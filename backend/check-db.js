import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.sqlite");

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Tables in database:");
    rows.forEach((row) => console.log(" -", row.name));

    // Check if voting_topics exists
    const hasVotingTopics = rows.some((row) => row.name === "voting_topics");
    if (hasVotingTopics) {
      db.all("SELECT * FROM voting_topics", (err, votingRows) => {
        if (err) {
          console.error("Error reading voting_topics:", err);
        } else {
          console.log("\nVoting topics:", votingRows);
        }
        db.close();
      });
    } else {
      console.log("\n❌ voting_topics table does NOT exist!");
      db.close();
    }
  }
});
