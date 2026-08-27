#!/usr/bin/env node
import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(
    "Usage: node scripts/set-android-version.mjs <major.minor.patch>",
  );
}

const [, major, minor, patch] = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
const versionCode =
  Number(major) * 1_000_000 + Number(minor) * 1_000 + Number(patch);
if (!Number.isSafeInteger(versionCode) || versionCode <= 0) {
  throw new Error(`Invalid Android versionCode derived from ${version}`);
}

const rootPrefix = await access("capacitor-app/android/app/build.gradle")
  .then(() => ".")
  .catch(() => "..");
const gradlePath = join(rootPrefix, "capacitor-app/android/app/build.gradle");
const source = await readFile(gradlePath, "utf8");
const updated = source
  .replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
  .replace(/versionName\s+"[^"]+"/, `versionName "${version}"`);

if (
  updated === source ||
  !updated.includes(`versionCode ${versionCode}`) ||
  !updated.includes(`versionName "${version}"`)
) {
  throw new Error(`Could not update ${gradlePath}`);
}
await writeFile(gradlePath, updated);
console.log(`Android version set to ${version} (versionCode ${versionCode})`);
