import { MdNotifications, MdAccountCircle } from 'react-icons/md';

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