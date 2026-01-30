import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DevTask,
  groupTasksByStatus,
} from "@/data/dev/dashboardData";

describe("groupTasksByStatus", () => {
  it("buckets tasks into status keys", () => {
    const tasks: DevTask[] = [
      {
        id: "1",
        title: "One",
        summary: "task",
        owner: "Dev",
        status: "backlog",
        repoId: "repo",
        files: [],
        priority: "low",
      },
      {
        id: "2",
        title: "Two",
        summary: "task",
        owner: "Dev",
        status: "in-progress",
        repoId: "repo",
        files: [],
        priority: "low",
      },
    ];

    const grouped = groupTasksByStatus(tasks);
    assert.equal(grouped["backlog"].length, 1);
    assert.equal(grouped["in-progress"].length, 1);
    assert.equal(grouped["review"].length, 0);
    assert.equal(grouped["done"].length, 0);
  });
});
