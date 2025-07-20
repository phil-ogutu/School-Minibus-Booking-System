import React from 'react';

function Text({ children, className = '', style = {}, as: Tag = 'p' }) {
  return (
    <Tag  className={className} style={style}>
      {children}
    </Tag>
  );
}

export default Text;