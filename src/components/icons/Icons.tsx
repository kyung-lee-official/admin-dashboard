import { MenuKey, useSidebarStore } from "@/stores/sidebar";
import classNames from "classnames";
import Link from "next/link";
import React from "react";

type SidebarIconProps = {
	icon: any;
	menuKey: MenuKey;
	text?: string;
};

export const SidebarIcon = ({ icon, menuKey, text }: SidebarIconProps) => {
	let sidebarIcon;
	const selectedMenu = useSidebarStore((state) => state.selectedMenu);
	if (selectedMenu === menuKey) {
		sidebarIcon = classNames("sidebar-icon-active");
	} else {
		sidebarIcon = classNames("sidebar-icon");
	}
	const menus = useSidebarStore((state) => state.menus);
	const menu = menus.find((menu) => {
		return menu.menuKey === menuKey;
	});
	if (menu) {
		return (
			<Link
				href={menu.subMenu[0].link}
				className={`${sidebarIcon} group`}
			>
				{icon}
				{text ? (
					<span className="sidebar-tooltip group-hover:scale-100">
						{text}
					</span>
				) : null}
			</Link>
		);
	} else {
		return null;
	}
};

export const Home = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 20 20"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7z"></path>
		</svg>
	);
};

export const Manual = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-1 4v2h-5V7h5zm-5 4h5v2h-5v-2zM4 19V5h7v14H4z"></path>
		</svg>
	);
};

export const Performance = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M6 21H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1z"></path>
		</svg>
	);
};

export const Crawler = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 576 512"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="currentColor"
				d="M563.3 401.6c2.608 8.443-2.149 17.4-10.62 19.1l-15.35 4.709c-8.48 2.6-17.47-2.139-20.08-10.59L493.2 338l-79.79-31.8 53.47 62.15c5.08 5.904 6.972 13.89 5.08 21.44l-28.23 110.1c-2.151 8.57-10.87 13.78-19.47 11.64l-15.58-3.873c-8.609-2.141-13.84-10.83-11.69-19.4l25.2-98.02-38.51-44.77c.153 2.205.663 4.307.663 6.549 0 53.02-43.15 96-96.37 96S191.6 405 191.6 352c0-2.242.512-4.34.663-6.543l-38.51 44.76 25.2 98.02c2.15 8.574-3.084 17.26-11.69 19.4l-15.58 3.873c-8.603 2.141-17.32-3.072-19.47-11.64l-28.23-110.1a23.936 23.936 0 0 1 5.08-21.44l53.47-62.15-79.79 31.8-24.01 77.74c-2.608 8.447-11.6 13.19-20.08 10.59l-15.35-4.709c-8.478-2.6-13.23-11.55-10.63-19.1l27.4-88.69a24.067 24.067 0 0 1 14.09-15.24L158.9 256 54.2 214.27c-6.77-2.67-11.94-9.17-14.09-15.17l-27.39-88.7c-2.608-8.443 2.149-17.4 10.62-19.1l15.35-4.709c8.48-2.6 17.47 2.139 20.08 10.59l24.01 77.74 79.79 31.8L109.1 143.6c-5.1-5.9-7-13.9-5.1-21.4l28.23-110.1C134.381 3.53 143.1-1.68 151.7.46l15.58 3.873C175.9 6.494 181.1 15.18 178.1 23.76l-24.3 98.04 53.9 62.6.154-24.44C206.1 123.4 228.9 91.77 261.4 80.43c5.141-1.793 10.5 2.215 10.5 7.641V112h32.12V88.09c0-5.443 5.394-9.443 10.55-7.641C345.9 91.39 368.3 121 368.3 155.9c0 1.393-.179 2.689-.25 4.064l.25 24.436 53.91-62.66-25.2-98.02c-2.151-8.574 3.084-17.26 11.69-19.4L424.28.447c8.603-2.141 17.32 3.072 19.47 11.64l28.23 110.1c1.894 7.543 0 15.53-5.08 21.44l-53.47 62.15 79.79-31.8 24.01-77.74c2.608-8.447 11.6-13.19 20.08-10.59l15.35 4.709c8.478 2.6 13.23 11.55 10.63 19.1l-27.4 88.69a24.067 24.067 0 0 1-14.09 15.24L417.1 256l104.7 41.73a24.047 24.047 0 0 1 14.07 15.21l27.43 88.66z"
			></path>
		</svg>
	);
};

export const ChevronLeftOutline = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g>
				<path d="M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z"></path>
			</g>
		</svg>
	);
};

export const ChevronRightOutline = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g>
				<path d="M10.5 17a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42L13.1 12 9.92 8.69a1 1 0 0 1 0-1.41 1 1 0 0 1 1.42 0l3.86 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-.7.32z"></path>
			</g>
		</svg>
	);
};

export const ChevronDownOutline = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			className="pointer-events-none"
		>
			<g>
				<path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path>
			</g>
		</svg>
	);
};

export const Calendar = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			className="pointer-events-none"
		>
			<path d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"></path>
		</svg>
	);
};

export const Load = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="20" r="2"></circle>
			<circle cx="12" cy="4" r="2"></circle>
			<circle cx="6.343" cy="17.657" r="2"></circle>
			<circle cx="17.657" cy="6.343" r="2"></circle>
			<circle cx="4" cy="12" r="2.001"></circle>
			<circle cx="20" cy="12" r="2"></circle>
			<circle cx="6.343" cy="6.344" r="2"></circle>
			<circle cx="17.657" cy="17.658" r="2"></circle>
		</svg>
	);
};

export const SignOut = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path fill="none" d="M0 0h24v24H0V0z"></path>
			<path d="M5 5h6c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c.55 0 1-.45 1-1s-.45-1-1-1H5V5z"></path>
			<path d="m20.65 11.65-2.79-2.79a.501.501 0 0 0-.86.35V11h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7z"></path>
		</svg>
	);
};

export const SettingsIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path fill="none" d="M0 0h24v24H0z"></path>
			<path d="M2.132 13.63a9.942 9.942 0 0 1 0-3.26c1.102.026 2.092-.502 2.477-1.431.385-.93.058-2.004-.74-2.763a9.942 9.942 0 0 1 2.306-2.307c.76.798 1.834 1.125 2.764.74.93-.385 1.457-1.376 1.43-2.477a9.942 9.942 0 0 1 3.262 0c-.027 1.102.501 2.092 1.43 2.477.93.385 2.004.058 2.763-.74a9.942 9.942 0 0 1 2.307 2.306c-.798.76-1.125 1.834-.74 2.764.385.93 1.376 1.457 2.477 1.43a9.942 9.942 0 0 1 0 3.262c-1.102-.027-2.092.501-2.477 1.43-.385.93-.058 2.004.74 2.763a9.942 9.942 0 0 1-2.306 2.307c-.76-.798-1.834-1.125-2.764-.74-.93.385-1.457 1.376-1.43 2.477a9.942 9.942 0 0 1-3.262 0c.027-1.102-.501-2.092-1.43-2.477-.93-.385-2.004-.058-2.763.74a9.942 9.942 0 0 1-2.307-2.306c.798-.76 1.125-1.834.74-2.764-.385-.93-1.376-1.457-2.477-1.43zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
		</svg>
	);
};

export const CloseIcon = ({ size, fill }: any) => {
	return (
		<svg
			viewBox="0 0 512 512"
			height="48"
			width="48"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="none"
				stroke="currentColor"
				strokeMiterlimit="10"
				strokeWidth="32"
				d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
			></path>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="32"
				d="M320 320 192 192m0 128 128-128"
			></path>
		</svg>
	);
};

export const CircleCheckIcon = ({ size, fill }: any) => {
	return (
		<svg
			viewBox="0 0 16 16"
			height="48"
			width="48"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"></path>
		</svg>
	);
};

export const CheckSquareFillIcon = ({ size, fill }: any) => {
	return (
		<svg
			viewBox="0 0 16 16"
			height={size}
			width={size}
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path>
		</svg>
	);
};

export const VerifiedIcon = ({ size, fill }: any) => {
	return (
		<svg
			viewBox="0 0 24 24"
			height="24"
			width="24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="24" height="24" fill="none"></rect>
			<path d="M23 11.99 20.56 9.2l.34-3.69-3.61-.82L15.4 1.5 12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 11.99l2.44 2.79-.34 3.7 3.61.82 1.89 3.2 3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69 2.44-2.8zm-3.95 1.48-.56.65.08.85.18 1.95-1.9.43-.84.19-.44.74-.99 1.68-1.78-.77-.8-.34-.79.34-1.78.77-.99-1.67-.44-.74-.84-.19-1.9-.43.18-1.96.08-.85-.56-.65L3.67 12l1.29-1.48.56-.65-.09-.86-.18-1.94 1.9-.43.84-.19.44-.74.99-1.68 1.78.77.8.34.79-.34 1.78-.77.99 1.68.44.74.84.19 1.9.43-.18 1.95-.08.85.56.65 1.29 1.47-1.28 1.48z"></path>
			<polygon points="10.09,13.75 7.77,11.42 6.29,12.91 10.09,16.72 17.43,9.36 15.95,7.87"></polygon>
		</svg>
	);
};

export const CopyIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path>
		</svg>
	);
};

export const UserIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
		</svg>
	);
};

export const EditIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 32 32"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M27.31 10.34a4 4 0 0 0-5.65-5.65l-1.4 1.4 5.65 5.66 1.4-1.4zm-2.81 2.82L12.54 25.12a5 5 0 0 1-2.32 1.31l-4.58 1.15a1 1 0 0 1-1.22-1.21l1.15-4.59a5 5 0 0 1 1.31-2.32L18.84 7.5l5.66 5.66z"></path>
		</svg>
	);
};

export const DeleteIcon = ({ size, fill }: any) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 48 48"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M24 6.75a6.25 6.25 0 0 1 6.25 6.02V13H37a1.75 1.75 0 0 1 .14 3.5h-1.31l-1.62 21.57A4.25 4.25 0 0 1 29.97 42H18.03a4.25 4.25 0 0 1-4.24-3.93L12.17 16.5H11c-.92 0-1.67-.7-1.74-1.6l-.01-.15c0-.92.7-1.67 1.6-1.74L11 13h6.75c0-3.3 2.55-6 5.8-6.23l.22-.02H24zm3.75 13c-.65 0-1.18.5-1.24 1.12l-.01.13v12.13a1.25 1.25 0 0 0 2.5 0V20.87a1.25 1.25 0 0 0-1.25-1.12zm-7.5 0c-.65 0-1.18.5-1.24 1.12L19 21v12.13a1.25 1.25 0 0 0 2.5 0V20.87a1.25 1.25 0 0 0-1.25-1.12zm3.92-9.5H24a2.75 2.75 0 0 0-2.75 2.58V13h5.5a2.75 2.75 0 0 0-2.58-2.74z"></path>
		</svg>
	);
};

export const CircleWithCrossIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 20 20"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M10 1.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8zm4.789 11.461L13.06 14.79 10 11.729l-3.061 3.06L5.21 13.06 8.272 10 5.211 6.939 6.94 5.211 10 8.271l3.061-3.061 1.729 1.729L11.728 10l3.061 3.061z"></path>
		</svg>
	);
};

export const SearchOutlineIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"></path>
		</svg>
	);
};

export const CrownIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 576 512"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="currentColor"
				d="M576 136c0 22.09-17.91 40-40 40-.248 0-.455-.127-.703-.13l-50.52 277.9C482 468.9 468.8 480 453.3 480H122.7c-15.46 0-28.72-11.06-31.48-26.27L40.71 175.9c-.25 0-.46.1-1.61.1-22.09 0-40-17.91-40-40s18.81-40 40-40 40 17.91 40 40c0 8.998-3.521 16.89-8.537 23.57l89.63 71.7c15.91 12.73 39.5 7.544 48.61-10.68l57.6-115.2C255.1 98.34 247.1 86.34 247.1 72c0-22.09 18.8-40 40.9-40s39.1 17.91 39.1 40c0 14.34-7.963 26.34-19.3 33.4l57.6 115.2c9.111 18.22 32.71 23.4 48.61 10.68l89.63-71.7C499.5 152.9 496 144.1 496 136c0-22.1 17.9-40 40-40s40 17.9 40 40z"
			></path>
		</svg>
	);
};

export const MoreVerticalOutlineIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g data-name="Layer 2">
				<g data-name="more-vertical">
					<circle cx="12" cy="12" r="2"></circle>
					<circle cx="12" cy="5" r="2"></circle>
					<circle cx="12" cy="19" r="2"></circle>
				</g>
			</g>
		</svg>
	);
};

export const IdIcon = ({ size, fill }: any) => {
	return (
		<svg height={size} width={size} viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.37868 2.87868C3.94129 2.31607 4.70435 2 5.5 2H19.5C20.2956 2 21.0587 2.31607 21.6213 2.87868C22.1839 3.44129 22.5 4.20435 22.5 5V19C22.5 19.7956 22.1839 20.5587 21.6213 21.1213C21.0587 21.6839 20.2956 22 19.5 22H5.5C4.70435 22 3.94129 21.6839 3.37868 21.1213C2.81607 20.5587 2.5 19.7956 2.5 19V5C2.5 4.20435 2.81607 3.44129 3.37868 2.87868ZM7.65332 16.3125H9.47832V7.6875H7.65332V16.3125ZM11.23 7.6875V16.3125H14.2925C15.6008 16.3125 16.6091 15.9417 17.3175 15.2C18.0341 14.4583 18.3925 13.3917 18.3925 12C18.3925 10.6083 18.0341 9.54167 17.3175 8.8C16.6091 8.05833 15.6008 7.6875 14.2925 7.6875H11.23ZM15.955 14.0625C15.5466 14.4625 14.9925 14.6625 14.2925 14.6625H13.055V9.3375H14.2925C14.9925 9.3375 15.5466 9.5375 15.955 9.9375C16.3633 10.3375 16.5675 11.025 16.5675 12C16.5675 12.975 16.3633 13.6625 15.955 14.0625Z"
			></path>
		</svg>
	);
};

export const ArrowBackIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 24 24"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path>
		</svg>
	);
};

export const PlusIcon = ({ size, fill }: any) => {
	return (
		<svg
			height={size}
			width={size}
			viewBox="0 0 20 20"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export const GoogleIcon = ({ size, fill }: any) => {
	return (
		<svg
			width={(705.6 / 720) * size}
			height={size}
			viewBox="0 0 186.69 190.5"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g transform="translate(1184.583 765.171)">
				<path
					clipPath="none"
					mask="none"
					d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
					fill="#4285f4"
				/>
				<path
					clipPath="none"
					mask="none"
					d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
					fill="#34a853"
				/>
				<path
					clipPath="none"
					mask="none"
					d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
					fill="#fbbc05"
				/>
				<path
					d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
					fill="#ea4335"
					clipPath="none"
					mask="none"
				/>
			</g>
		</svg>
	);
};
