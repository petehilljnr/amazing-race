import Dexie from 'dexie';

class QueuedSubmissionsDB extends Dexie {
  constructor() {
    super('QueuedSubmissionsDB');
    this.version(1).stores({
      queuedSubmissions: '[taskId+teamId], taskId, teamId, answerType, answer, modifiedTime'
    });
    this.queuedSubmissions = this.table('queuedSubmissions');
  }
}

const queuedDb = new QueuedSubmissionsDB();

export default queuedDb;

/**
 * Adds or updates a queued submission in the Dexie store.
 * If a submission with the same [taskId + teamId] exists, it will be overwritten.
 * @param {Object} submission - { taskId, teamId, answerType, answer, modifiedTime }
 */
export async function upsertQueuedSubmission(submission) {
  await queuedDb.queuedSubmissions.put(submission);
}

/**
 * Removes a queued submission from the Dexie store using [taskId + teamId].
 * @param {string} taskId
 * @param {string} teamId
 */
export async function removeQueuedSubmission(taskId, teamId) {
  await queuedDb.queuedSubmissions.delete([taskId, teamId]);
}
