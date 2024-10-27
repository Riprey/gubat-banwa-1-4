import * as fs from "node:fs";
import * as path from "node:path";

import { compilePack, extractPack } from "@foundryvtt/foundryvtt-cli";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const PACK_DEST = "packs";
const PACK_SRC = "packs/_source";

// eslint-disable-next-line
const argv = yargs(hideBin(process.argv))
  .command(packageCommand())
  .help()
  .alias("help", "h").argv;

/**
 * Actions a command given the CLI arguments.
 * @returns {void}
 */
function packageCommand() {
  return {
    command: "package [action] [pack] [entry]",
    describe: "Manage packages",
    builder: (yargs) => {
      yargs.positional("action", {
        describe: "The action to perform.",
        type: "string",
        choices: ["unpack", "pack", "clean"],
      });
      yargs.positional("pack", {
        describe: "Name of the pack upon which to work.",
        type: "string",
      });
      yargs.positional("entry", {
        describe:
          "Name of any entry within a pack upon which to work. Only applicable to extract & clean commands.",
        type: "string",
      });
    },
    handler: async (argv) => {
      const { action, pack, entry } = argv;
      switch (action) {
        case "pack":
          return await compilePacks(pack);
        case "unpack":
          return await extractPacks(pack, entry);
      }
    },
  };
}

/**
 * Cleans a Compendium entry, removing weird artifacts from creating the items manually
 * and by copying text from a PDF.
 * @param {object} data Data to be cleaned.
 */
function cleanPackEntry(data) {
  if (data.ownership) data.ownership = { default: 0 };
  if (data._stats?.lastModifiedBy)
    data._stats.lastModifiedBy = "GubatBanwaPacker";
  if (data.author) data.author = "GubatBanwaPacker";

  // Recursively clean embedded objects.
  if (data.effects) data.effects.forEach((o) => cleanPackEntry(o));
  if (data.system?.description)
    data.system.description = cleanString(data.system.description);
  if (data.system?.flavor) data.system.flavor = cleanString(data.system.flavor);

  // Recursively clean specific fields for certain document types.
  // For Disciplines:
  if (data.system?.violences) {
    cleanPackEntry(data.system.violences);
    if (data.system.violences.attacks) {
      Object.keys(data.system.violences.attacks).forEach((key) => {
        cleanPackEntry(data.system.violences.attacks[key]);
      });
    }
  }
  if (data.system?.trait) cleanPackEntry(data.system.trait);
  // For NPCs:
  if (data.system?.traits) data.system.traits.forEach((o) => cleanPackEntry(o));

  // The features cleaned for recursions.
  if (data.description) data.description = cleanString(data.description);
  if (data.flavor) data.flavor = cleanString(data.flavor);
  if (data.name) data.name = cleanString(data.name);
}

/**
 * Replaces fancy punctuation with regular punctuation and removes invisible whitespace.
 * @param {string} str String to be cleaned.
 * @returns {string} Cleaned string.
 */
function cleanString(str) {
  return str
    .replace(/\u2060/gu, "")
    .replace(/[‘’]/gu, "'")
    .replace(/[“”]/gu, '"')
    .replace(/[–]/gu, "-");
}

/**
 * Pack the source JSON files into Compendium Packs (LevelDB files).
 * @param {string} [packName]       Name of pack to compile. If none provided, all packs will be packed.
 *
 * - `npm run build:db` - Compile all JSON files into their LevelDB files.
 * - `npm run build:db -- classes` - Only compile the specified pack.
 */
async function compilePacks(packName) {
  // Determine which source folders to process
  const folders = fs
    .readdirSync(PACK_SRC, { withFileTypes: true })
    .filter(
      (file) => file.isDirectory() && (!packName || packName === file.name),
    );
  for (const folder of folders) {
    const src = path.join(PACK_SRC, folder.name);
    const dest = path.join(PACK_DEST, folder.name);
    console.info(`Compiling pack ${folder.name}`);
    await compilePack(src, dest, {
      recursive: true,
      log: true,
      transformEntry: cleanPackEntry,
    });
  }
}

/**
 * Unpacks Compendium Packs' LevelDB Files into JSON files.
 * @param {string} [packName]       Name of pack to extract. If none provided, all packs will be unpacked.
 * @param {string} [entryName]      Name of a specific entry to extract.
 *
 * - `npm build:json - Extract all compendium LevelDB files into JSON files.
 * - `npm build:json -- classes` - Only extract the contents of the specified compendium.
 * - `npm build:json -- classes Barbarian` - Only extract a single item from the specified compendium.
 */
async function extractPacks(packName, entryName) {
  entryName = entryName?.toLowerCase();

  // Load system.json.
  const system = JSON.parse(
    fs.readFileSync("./system.json", { encoding: "utf8" }),
  );

  // Determine which source packs to process.
  const packs = system.packs.filter((p) => !packName || p.name === packName);

  for (const packInfo of packs) {
    const dest = path.join(PACK_SRC, packInfo.name);
    console.info(`Extracting pack ${packInfo.name}`);

    const folders = {};
    const containers = {};
    await extractPack(packInfo.path, dest, {
      log: false,
      transformEntry: (e) => {
        if (e._key.startsWith("!folders"))
          folders[e._id] = { name: slugify(e.name), folder: e.folder };
        else if (e.type === "container")
          containers[e._id] = {
            name: slugify(e.name),
            container: e.system?.container,
            folder: e.folder,
          };
        return false;
      },
    });
    const buildPath = (collection, entry, parentKey) => {
      let parent = collection[entry[parentKey]];
      entry.path = entry.name;
      while (parent) {
        entry.path = path.join(parent.name, entry.path);
        parent = collection[parent[parentKey]];
      }
    };
    Object.values(folders).forEach((f) => buildPath(folders, f, "folder"));
    Object.values(containers).forEach((c) => {
      buildPath(containers, c, "container");
      const folder = folders[c.folder];
      if (folder) c.path = path.join(folder.path, c.path);
    });

    await extractPack(packInfo.path, dest, {
      log: true,
      transformEntry: (entry) => {
        if (entryName && entryName !== entry.name.toLowerCase()) return false;
        cleanPackEntry(entry);
      },
      transformName: (entry) => {
        if (entry._id in folders)
          return path.join(folders[entry._id].path, "_folder.json");
        if (entry._id in containers)
          return path.join(containers[entry._id].path, "_container.json");
        const outputName = slugify(entry.name);
        const parent =
          containers[entry.system?.container] ?? folders[entry.folder];
        return path.join(parent?.path ?? "", `${outputName}.json`);
      },
    });
  }
}

/**
 * Standardize name format.
 * @param {string} name Name of Compendium entry
 * @returns {string} Name of Compendium Entry's source filename.
 */
function slugify(name) {
  return name
    .toLowerCase()
    .replace("'", "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .replace(/\s+|-{2,}/g, "-");
}
