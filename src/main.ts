import { BiMark } from "bimark";
import yargs from "yargs";
import {
  statSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
} from "fs";

const argv = yargs(process.argv.slice(2))
  .usage("Usage: bimark [options] <file|folder> [file|folder]...")
  .options({
    da: {
      alias: "def-alias",
      type: "boolean",
      description: "Show definition alias",
      default: false,
    },
    db: {
      alias: "def-bracket",
      type: "boolean",
      description: "Show definition bracket",
      default: false,
    },
    rb: {
      alias: "ref-bracket",
      type: "boolean",
      description: "Show reference bracket",
      default: false,
    },
    rh: {
      alias: "ref-html",
      type: "boolean",
      description: "Render reference as HTML",
      default: false,
    },
    f: {
      alias: "filter",
      type: "string",
      description: "Filter by file suffix",
      default: ".md",
    },
    o: {
      alias: "output",
      type: "string",
      description: "Output path",
      default: "",
    },
  })
  .parseSync();

const bimark = new BiMark();

function collectFile(path: string) {
  bimark.collect(path, readFileSync(path, "utf-8"));
}

function renderFile(path: string) {
  const res = bimark.render(path, readFileSync(path, "utf-8"), {
    def: { showAlias: argv.da, showBrackets: argv.db },
    ref: { showBrackets: argv.rb, html: argv.rh },
  });
  if (argv.o) {
    mkdirSync((argv.o + "/" + path).split("/").slice(0, -1).join("/"), {
      recursive: true,
    });
    writeFileSync(argv.o + "/" + path, res);
  } else {
    console.log(res);
  }
}

function traverseFolder(path: string, cb: (path: string) => void) {
  readdirSync(path, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isFile()) {
      if (dirent.name.endsWith(argv.f)) {
        cb(path + "/" + dirent.name);
      }
    } else if (dirent.isDirectory()) {
      traverseFolder(path + "/" + dirent.name, cb);
    }
  });
}

// collect
(argv._ as string[]).forEach((path) => {
  if (statSync(path).isFile()) collectFile(path);
  else traverseFolder(path, collectFile);
});

// render
(argv._ as string[]).forEach((path) => {
  if (statSync(path).isFile()) renderFile(path);
  else traverseFolder(path, renderFile);
});
