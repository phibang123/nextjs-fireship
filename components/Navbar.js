import React, { useContext } from "react";

import Link from "next/link";
import { UserContext } from "../lib/context";

export default function Navbar() {
	const { user, username } = useContext(UserContext);

	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link href="/">
						<button className="btn-logo">NXT</button>
					</Link>
				</li>
				{username && (
					<>
						<li className="push-left">
							<Link href="/admin">
								<button className="btn-blue">Write Posts</button>
							</Link>
						</li>
						<li>
							<Link href="/enter">
								<button className="btn-gray">Log out</button>
							</Link>
						</li>
						<li>
							<Link href={`/${username}`}>
                <img src={user?.photoURL || '/hacker.png'} />
              </Link>
						</li>
					</>
				)}
				{!username && (
					<>
						<li>
							<Link href="/enter">
								<button className="btn-blue">Login</button>
							</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
}
