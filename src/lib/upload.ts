// for future using Storage
// import { storage } from './firebase'; 
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// const upload = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log(`Upload is ${progress.toFixed(0)}% done`);
//       },
//       (error) => {
//         console.error("Upload failed:", error);
//         reject(error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref)
//           .then((downloadURL) => {
//             console.log('File available at', downloadURL);
//             resolve(downloadURL);
//           })
//           .catch(reject);
//       }
//     );
//   });
// };

// export default upload;
