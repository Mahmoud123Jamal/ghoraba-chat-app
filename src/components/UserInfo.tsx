import "../styles/components/UserInfo.css";
import DefaultAvatar from "../assets/avatar.png";
import moreIcon from "../assets/more.png";
import videoIcon from "../assets/video.png";
import editIcon from "../assets/edit.png";
import { useUserStore } from "../lib/userStore";
import { useState, useRef, useEffect } from "react";
import ActionButtons from "./ActionButtons";

export default function UserInfo() {
  const { currentUser } = useUserStore();
  const [showActions, setShowActions] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  const toggleActions = () => {
    setShowActions((prev) => !prev);
  };

  // Close the action menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-info p-3 position-relative">
      <div className="d-flex align-items-center">
      <img
  src={
    currentUser?.avatar && currentUser.avatar.startsWith("http")
      ? currentUser.avatar
      : DefaultAvatar
  }
  alt="User Avatar"
  className="user-avatar rounded-circle me-3"
/>
        <div>
          <h5 className="mb-0 text-light">{currentUser?.username || "User"}</h5>
          <small className="text-success">Online</small>
        </div>
      </div>
      <div className="user-actions d-flex gap-2 mt-2">
        <button className="btn btn-sm btn-icon" onClick={toggleActions}>
          <img src={moreIcon} alt="More" width={18} height={18} />
        </button>
        <button className="btn btn-sm btn-icon">
          <img src={videoIcon} alt="Video" width={18} height={18} />
        </button>
        <button className="btn btn-sm btn-icon">
          <img src={editIcon} alt="Edit" width={18} height={18} />
        </button>
      </div>

      {/* Action Buttons dropdown */}
      {showActions && (
        <div
          ref={actionRef}
          className="position-absolute bg-white border rounded p-2 shadow-sm"
          style={{ top: "70px", right: "15px", zIndex: "1000" }}
        >
          <ActionButtons />
        </div>
      )}
    </div>
  );
}
