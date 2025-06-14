import "../styles/components/List.css";
import UserInfo from "./UserInfo";
import ChatList from "./ChatList";
import { ListProps} from "../types";
 


export default function List({ onChatSelect }: ListProps) {
  return (
    <div className="list-container">
      <UserInfo />
      <ChatList onChatSelect={onChatSelect} />
    </div>
  );
}