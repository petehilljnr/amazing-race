
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from './firebase'; // adjust path as needed

const SUBMISSION_QUEUE_KEY = 'submissionQueue';

/**
 * Compresses an image file (including HEIC) and converts it to a base64 string.
 * @param {File} file - The image file from input.
 * @param {number} maxSizeKB - Maximum size in KB (default 100).
 * @returns {Promise<File>} - Compressed image file.
 */
async function prepareImage(file, maxSizeKB = 100) {
  let convertedFile = file;

  // Convert HEIC to JPEG if needed
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    try {
      const blob = await heic2any({ blob: file, toType: 'image/jpeg' });
      convertedFile = new File([blob], file.name.replace(/\.heic$/, '.jpg'), { type: 'image/jpeg' });
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw error;
    }
  }

  // Compress the image
  const options = {
    maxSizeMB: maxSizeKB / 1024,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(convertedFile, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
}

/**
 * Uploads image to Firebase Storage and returns the download URL.
 * @param {File} file - Compressed image file.
 * @returns {Promise<string>} - Download URL.
 */
async function uploadImage(file) {
  const storageRef = ref(storage, 'submissions/' + file.name);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Submits the object to Firestore.
 * @param {Object} submission - Submission object.
 */
async function submitToFirestore(submission) {
  await addDoc(collection(db, 'submissions'), submission);
}

/**
 * Handles submission logic including offline queuing.
 * @param {Object} data - { teamId, taskId, answer, photoFile }
 */
export async function handleSubmission(data) {
  const submission = {
    teamId: data.teamId,
    taskId: data.taskId,
    status: 'waiting to upload',
    answer: data.answer,
    photoURL: '',
  };

  if (navigator.onLine) {
    try {
      const compressed = await prepareImage(data.photoFile);
      const photoURL = await uploadImage(compressed);
      submission.photoURL = photoURL;
      submission.status = 'pending';
      await submitToFirestore(submission);
    } catch (error) {
      console.error('Upload failed, queuing submission:', error);
      queueSubmission({ ...submission, photoFile: data.photoFile });
    }
  } else {
    queueSubmission({ ...submission, photoFile: data.photoFile });
  }
}

/**
 * Queues submission in localStorage.
 * @param {Object} item - Submission object with photoFile.
 */
function queueSubmission(item) {
  const queue = JSON.parse(localStorage.getItem(SUBMISSION_QUEUE_KEY)) || [];
  queue.push(item);
  localStorage.setItem(SUBMISSION_QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Processes queued submissions when online.
 */
export async function processQueue() {
  const queue = JSON.parse(localStorage.getItem(SUBMISSION_QUEUE_KEY)) || [];
  const remaining = [];

  for (const item of queue) {
    try {
      const compressed = await prepareImage(item.photoFile);
      const photoURL = await uploadImage(compressed);
      const submission = {
        teamId: item.teamId,
        taskId: item.taskId,
        status: 'pending',
        answer: item.answer,
        photoURL,
      };
      await submitToFirestore(submission);
    } catch (error) {
      console.error('Retry failed, keeping in queue:', error);
      remaining.push(item);
    }
  }

  localStorage.setItem(SUBMISSION_QUEUE_KEY, JSON.stringify(remaining));
}

