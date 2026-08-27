#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(
    "Usage: node scripts/assert-release-version.mjs <major.minor.patch>",
  );
}

const toParts = (value) => value.split(".").map(Number);
const compare = (left, right) => {
  const a = toParts(left);
  const b = toParts(right);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
  }
  return 0;
};

const tags = execFileSync("git", ["tag", "--list", "v*"], { encoding: "utf8" })
  .split(/\r?\n/)
  .map((tag) => tag.replace(/^v/, ""))
  .filter((tag) => /^\d+\.\d+\.\d+$/.test(tag) && tag !== version);
const latest = tags.sort(compare).at(-1);
if (latest && compare(version, latest) <= 0) {
  throw new Error(
    `Release ${version} is not newer than the latest existing release ${latest}`,
  );
}
console.log(
  latest
    ? `Release ${version} is newer than ${latest}`
    : `Release ${version} is the first release`,
);
