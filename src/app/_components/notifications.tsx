import { FC, Fragment } from "react";
import { Notify } from "./notify";
import { BellIcon, BellOffIcon } from "lucide-react";

type NotificationsProps = {
  notifications: {
    id: string;
    type: string;
    subject: string;
    body: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export const Notifications: FC<NotificationsProps> = ({ notifications }) => {
  return (
    <Fragment>
      <div>{notifications.length}</div>
      <div>{notifications.length ? <BellIcon /> : <BellOffIcon />}</div>
      <div className="p-5">
        {notifications.map((notification) => (
          <div key={notification.id}>{notification.body}</div>
        ))}
      </div>
      <Notify notifications={notifications} />
    </Fragment>
  );
};
