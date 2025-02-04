import React from 'react';
import Popup, { PopupProps } from '../Popup';
import MessageCard, {
  MessageCardProps,
} from '../../Card/MessageCard/MessageCard';

function MessagePopup({
  visible,
  onCancel,
  closeable,
  buttonText,
  onButtonClick,
  description,
  title,
  imagePath,
  className,
  style,
}: Omit<PopupProps & MessageCardProps, 'children'>) {
  return (
    <Popup
      visible={visible}
      style={style}
      className={className}
      onCancel={onCancel}
      closeable={closeable}
    >
      <MessageCard
        imagePath={imagePath}
        description={description}
        title={title}
        buttonText={buttonText}
        onButtonClick={onButtonClick}
      />
    </Popup>
  );
}

export default MessagePopup;
