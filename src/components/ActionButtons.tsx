import { authService } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";

export default function ActionButtons() {
  const isReciverBlocked = useChatStore((state) => state.isReciverBlocked);
  const changeBlocked = useChatStore((state) => state.changeBlocked);

  const handleBlock = async () => {
    changeBlocked();
  };

  return (
    <div className="d-flex flex-column gap-2">
      <button
        className={`btn btn-sm w-100 rounded ${
          isReciverBlocked ? "btn-success" : "btn-danger"
        }`}
        onClick={handleBlock}
      >
        {isReciverBlocked ? "Unblock User" : "Block User"}
      </button>

      <button
        className="btn btn-sm w-100 btn-primary rounded"
        onClick={() => {
          authService.signOut();
        }}
      >
        Log out
      </button>
    </div>
  );
}
