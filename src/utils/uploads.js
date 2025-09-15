import queuedDb from '../stores/queuedSubmissions';
import { db, storage } from '../firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Processes all queued submissions: uploads to Firebase and removes from Dexie.
 */
function base64ToBlob(base64) {
  const parts = base64.split(',');
  const mimeType = parts[0].match(/:(.*?);/)[1];
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

export async function processQueuedSubmissions() {
  const allQueued = await queuedDb.queuedSubmissions.toArray();

  for (const item of allQueued) {
    let answer = item.answer;
    if (item.answerType === 'photo' && answer) {
      // Convert base64 image to Blob
      const blob = base64ToBlob(answer);
      
      // Get extension from blob mime type
      const mimeType = blob.type;
      let extension = 'jpg';
      if (mimeType === 'image/png') extension = 'png';
      else if (mimeType === 'image/jpeg') extension = 'jpg';
      else if (mimeType === 'image/webp') extension = 'webp';
      else if (mimeType === 'image/gif') extension = 'gif';
      // Add more types as needed
      const filename = `${item.teamId}_${item.taskId}_${Date.now()}.${extension}`;
      const storageRef = ref(storage, `submissions/${filename}`);
      await uploadBytes(storageRef, blob);
      answer = await getDownloadURL(storageRef);
    }

    // Prepare submission object
    const submission = {
      taskId: item.taskId,
      teamId: item.teamId,
      answerType: item.answerType,
      answer,
      status: 'pending',
      modifiedTime: item.modifiedTime,
    };

    // Overwrite any existing submission with same [taskId + teamId]
    const submissionDocRef = doc(db, 'submissions', `${item.taskId}_${item.teamId}`);
    await setDoc(submissionDocRef, submission);

    // Remove from Dexie store
    await queuedDb.queuedSubmissions.delete([item.taskId, item.teamId]);
  }
}
