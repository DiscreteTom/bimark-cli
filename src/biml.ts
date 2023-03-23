#!/usr/bin/env node

import { BiML } from "bimark";
import yargs from "yargs";
import {
  statSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
} from "fs";

const argv = yargs(process.argv.slice(2))
  .usage("Usage: biml [options] <file|folder> [file|folder]...")
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
    f: {
      alias: "filter",
      type: "string",
      description: "Filter by file suffix",
      default: ".html",
    },
    o: {
      alias: "output",
      type: "string",
      description: "Output path",
      default: "",
    },
    cs: {
      alias: "collect-selectors",
      type: "array",
      description: "Query selectors when collect",
      default: [],
    },
    ds: {
      alias: "render-def-selectors",
      type: "array",
      description: "Query selectors when render definition",
      default: [],
    },
    rs: {
      alias: "render-ref-selectors",
      type: "array",
      description: "Query selectors when render reference",
      default: [],
    },
  })
  .parseSync();

const biml = new BiML();

function collectFile(path: string) {
  biml.collect(path, readFileSync(path, "utf-8"), {
    selectors: argv.cs.length == 0 ? undefined : (argv.cs as string[]),
  });
}

function renderFile(path: string) {
  const res = biml.render(path, readFileSync(path, "utf-8"), {
    def: {
      showAlias: argv.da,
      showBrackets: argv.db,
      selectors: argv.ds.length == 0 ? undefined : (argv.ds as string[]),
    },
    ref: {
      showBrackets: argv.rb,
      selectors: argv.rs.length == 0 ? undefined : (argv.rs as string[]),
    },
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
