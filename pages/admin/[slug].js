import React, { useState } from "react";
import { auth, firestore } from "../../lib/firebase";
import { useForm, useFormState } from "react-hook-form";

import AuthCheck from "../../components/AuthCheck";
import { ErrorMessage } from "@hookform/error-message";
import ImageUpLoader from "../../components/ImageUpLoader"
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { serverTimestamp } from "firebase/firestore";
import styles from "../../styles/Admin.module.css";
import toast from "react-hot-toast";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

export default function AdminPostEdit(props) {
	return (
		<AuthCheck>
			<PostManager></PostManager>
		</AuthCheck>
	);
}
function PostManager() {
	const [preview, setPreview] = useState(false);

	const router = useRouter();
	const { slug } = router.query;

	const postRef = firestore
		.collection("users")
		.doc(auth.currentUser.uid)
		.collection("posts")
		.doc(slug);

	const [post] = useDocumentData(postRef);
	//=>> keu63 khi có nhiều cái tree thì sử dung5 thàng này

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? "Edit" : "Preview"}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="btn-blue">Live view</button>
						</Link>
						<DeletePostButton postRef={postRef}></DeletePostButton>
					</aside>
				</>
			)}
		</main>
	);
}
function PostForm({ defaultValues, postRef, preview }) {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
		control,
	} = useForm({
		defaultValues,
		mode: "onChange",
	});

	const { isValid, isDirty } = useFormState({
		control,
	});

	const updatePost = async ({ content, published }) => {
		await postRef.update({
			content,
			published,
			updatedAt: serverTimestamp(),
		});

		reset({ content, published });

		toast.success("Post updated successfully!");
	};
  
  
	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="card">
					<ReactMarkdown>{watch("content")}</ReactMarkdown>
				</div>
			)}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUpLoader/>
				<textarea
					{...register("content", {
						maxLength: { value: 20000, message: "content is too long" },
						minLength: { value: 10, message: "content is too short" },
						required: { value: true, message: "content is required" },
					})}
				></textarea>
				{
					<ErrorMessage
						errors={errors}
						name="content"
						render={({ message }) => <p className="text-danger">{message}</p>}
					/>
				}
				<fieldset>
					<input
						className={styles.checkbox}
						type="checkbox"
						{...register("published", { required: true })}
					/>
					<label>Published</label>
				</fieldset>

				<button
					type="submit"
					className="btn-green"
					disabled={!isDirty || !isValid}
				>
					Save Changes
				</button>
			</div>
		</form>
	);
}

function DeletePostButton({ postRef })
{
	const router = useRouter();

	const deletePost = async () =>
	{
		const doIt = confirm("are you sure!!");

		if (doIt)
		{
			await postRef.delete();
			router.push("/admin");
			toast('post annihilated', {
				icon: '🗑️'
			})
		}
	}
	return (
		<button className="btn-red" onClick={deletePost}>Delete</button>
	)
}