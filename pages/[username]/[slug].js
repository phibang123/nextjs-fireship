import React, { useContext } from "react";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";

import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";
import PostContent from "../../components/PostContent";
import { UserContext } from "../../lib/context";
import styles from "../../styles/Post.module.css";
import { useDocumentData } from "react-firebase-hooks/firestore";

export async function getStaticProps({ params }) {
	const { username, slug } = params;
	const userDoc = await getUserWithUsername(username);

	let post;
	let path;

	if (userDoc) {
		const postRef = userDoc.ref.collection("posts").doc(slug);
		post = JSON.parse(JSON.stringify(postToJSON(await postRef.get())));

		path = postRef.path;
	}

	return {
		props: { post, path },
		revalidate: 100,
	};
}

export async function getStaticPaths() {
	// Improve my using Admin SDK to select empty docs
	const snapshot = await firestore.collectionGroup("posts").get();
	
	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		//must be in the format:
		//paths: [
		//   {params:{ username,slug}}
		//]
		paths,
		fallback: "blocking",
	};
}

export default function PostPage(props) {
	const postRef = firestore.doc(props.path);
	const [realTimePost] = useDocumentData(postRef);
	const { user: currentUser } = useContext(UserContext);
	const post = realTimePost || props.post;
	return (
		<main className={styles.container}>
			<section>
				<PostContent post={post}></PostContent>
			</section>
			<aside className="card">
				<p>
					<strong>{post.heartCount || 0} 🤍</strong>
				
				</p>
				<AuthCheck fallback={<Link href="/enter">💗 Sign Up</Link>}>
						<HeartButton postRef={postRef}></HeartButton>
				</AuthCheck>
				{
					currentUser?.uid === post.uid && (
						<Link href={`/admin/${ post.slug }`}>
							<button className="btn-blue">Edit post</button>
						</Link>
					)
				}
			</aside>
		</main>
	);
}
