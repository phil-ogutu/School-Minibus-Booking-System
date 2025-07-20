import { MdNotifications, MdAccountCircle, MdDirectionsBus } from 'react-icons/md';
import { TiGroup } from "react-icons/ti";
import { RiMapPin2Fill } from "react-icons/ri";
import { FaPlay } from "react-icons/fa";

/**
 * Generic icon renderer
 * @param {JSX.Element} IconComponent - The icon component from react-icons
 * @param {string} color - Tailwind class for color (e.g., "text-primary")
 * @param {string} size - Tailwind class for size (e.g., "text-xl")
 * @param {object} style - Inline style object (optional)
 */

const renderIcon = (IconComponent, color = '', size = '', style = {}) => (
  <IconComponent className={`${color} ${size}`} style={style} />
);

export const notificationIcon = (color = '', size = '', style = {}) =>
  renderIcon(MdNotifications, color, size, style);

export const accountIcon = (color = '', size = '', style = {}) =>
  renderIcon(MdAccountCircle, color, size, style);

export const busIcon = (color = '', size = '', style = {}) =>
  renderIcon(MdDirectionsBus, color, size, style);

export const groupIcon = (color = '', size = '', style = {}) =>
  renderIcon(TiGroup, color, size, style);

export const mapPinIcon = (color = '', size = '', style = {}) =>
  renderIcon(RiMapPin2Fill, color, size, style);

export const playIcon = (color = '', size = '', style = {}) =>
  renderIcon(FaPlay, color, size, style);