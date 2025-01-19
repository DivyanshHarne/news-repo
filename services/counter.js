const db = require('../DataBase/database');
const { server_start_time } = require('./timer');


const updatePublishedStoriesCount = async () => { // for counting
    try {
        const serverStartTime = new Date(server_start_time);
        const fiveMinutesBefore = new Date(serverStartTime.getTime() - 5 * 60 * 1000);
        const [rows] = await db.promise().query(`SELECT COUNT(*) AS storyCount FROM hacker_news WHERE time BETWEEN ? AND ?`, [fiveMinutesBefore, serverStartTime]);
        const storyCount = rows[0].storyCount;
        await db.promise().query(`UPDATE hacker_news SET published_stories_count = ?`, [storyCount]);
        console.log(`Published stories count updated: ${storyCount}`);
    } catch (error) {
        console.error('Error updating published stories count:', error.message);
    }
};

module.exports = { updatePublishedStoriesCount };