import { MdNotifications, MdAccountCircle, MdDirectionsBus, MdOutlineAdd, MdEdit, MdDeleteOutline } from 'react-icons/md';
import { TiGroup } from "react-icons/ti";
import { RiMapPin2Fill } from "react-icons/ri";
import { FaPlay, FaArrowRight, FaArrowLeft, FaFlag, FaLocationArrow, FaRoute, FaClipboardList } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
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

export const arrowLeftIcon = (color = '', size = '', style = {}) =>
  renderIcon(FaArrowLeft, color, size, style);

export const arrowRightIcon = (color = '', size = '', style = {}) =>
  renderIcon(FaArrowRight, color, size, style);

export const flagIcon = (color = '', size = '', style = {}) =>
  renderIcon(FaFlag, color, size, style);

export const arrowLocationIcon = (color = '', size = '', style = {}) =>
  renderIcon(FaLocationArrow, color, size, style);

export const addIcon = (color = '', size = '', style = {}) =>
  renderIcon(MdOutlineAdd, color, size, style);

export const editIcon = (color = '', size = '', style = {}) =>
  renderIcon(MdEdit, color, size, style);

export const deleteIcon = (color = '', size = '', style = {}) =>
  renderIcon(MdDeleteOutline, color, size, style);

export const warningIcon = (color = '', size = '', style = {}) =>
  renderIcon(IoIosWarning, color, size, style);

export const routeIcon = (color = '', size = '', style = {}) =>
  renderIcon(FaRoute, color, size, style);

export const bookingIcon = (color = '', size = '', style = {}) =>
  renderIcon(FaClipboardList, color, size, style);