import {Button, ListGroup, Offcanvas} from "react-bootstrap";
import React from "react";
import {NotificationData} from "../model/NotificationDataBuilder";

function Notifications(props: {show: boolean,
  hide: () => void,
  deleteNotification: (id: number) => void,
  deleteAllNotifications: () => void,
  notifications: Array<NotificationData>}) {

  let notifications: Array<NotificationData>;
  if (props.notifications && props.notifications.length > 0) {
    // Show the newest (the last in the list) first
    notifications = [...props.notifications].reverse();
  } else {
    notifications = []
  }
  return (
    <Offcanvas show={props.show} onHide={props.hide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Notifications</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body key={Date.now().valueOf()}>
        <>
          <Button variant={"primary"}
                  disabled={notifications.length === 0}
                  onClick={() => props.deleteAllNotifications()}>
            Clear all
          </Button>
          <ListGroup>
            {notifications.map(notification => {
              return <ListGroup.Item key={notification.id}>
                <Button variant={"link"} onClick={() => props.deleteNotification(notification.id)}>
                  Delete
                </Button>
                {
                  notification.message
                }
              </ListGroup.Item>
            })}
          </ListGroup>
        </>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default Notifications;