import {
    BlobWriter,
} from "@zip.js/zip.js";

export function createRepoFromEntries(entries, codename) {
    const repo = {
        version: 1,
        config: {
            rom: "Xiaomi Firmware Update",
        },
        devices: {
        }
    };
    repo.devices[codename] = {
        files: []
    };
    entries.forEach(async entry => {
        // get data from entry as blob
        let blob = await entry.getData(new BlobWriter("application/octet-stream"));
        repo.devices[codename].files.push({
            filename: entry.filename,
            partition: entry.filename.split(".")[0],
            blob: blob
        });
    });
    return repo;
}