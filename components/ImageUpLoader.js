import { STATE_CHANGED, auth, storage } from "../lib/firebase";

import Loading from "./Loading";
import { useState } from "react";

// Uploads images to Firebase Storage
export default function ImageUploader() {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [downloadURL, setDownloadURL] = useState(null);

	// Creates a Firebase Upload Task
	const uploadFile = async (e) => {
		try {
			// Get the file
			const file = Array.from(e.target.files)[0];
			const extension = file.type.split("/")[1];

			// Makes reference to the storage bucket location
			const ref = storage.ref(
				`u${auth.currentUser.uid}/${Date.now()}.${extension}`
			);
			setUploading(true);

			// Starts the upload
			const task = ref.put(file);

			// Listen to updates to upload task
			task.on(STATE_CHANGED, (snapshot) => {
				const pct = (
					(snapshot.bytesTransferred / snapshot.totalBytes) *
					100
				).toFixed(0);
				setProgress(pct);
			});

			// Get downloadURL AFTER task resolves (Note: this is not a native Promise)
			task
				.then((d) => ref.getDownloadURL())
				.then((url) => {
					setDownloadURL(url);
					setUploading(false);
				});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="box">
			<Loading show={uploading} />
			{uploading && <h3>{progress}%</h3>}

			{!uploading && (
				<>
					<label className="btn">
						📸 Upload Img
						<input
							type="file"
							onChange={uploadFile}
							accept="image/x-png,image/gif,image/jpeg"
						/>
					</label>
				</>
			)}

			{downloadURL && (
				<code className="upload-snippet">{`![alt](${downloadURL})`}</code>
			)}
		</div>
	);
}
