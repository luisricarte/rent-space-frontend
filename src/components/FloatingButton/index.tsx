import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export function FloatingButton() {
  const router = useRouter();
  const { data } = useSession();

  const isPlaceOwner = data?.user && data?.user?.userType === "PLACE_OWNER";

  if (!isPlaceOwner) return null;

  const navigateToNewSpace = () => {
    router.push("/space/new");
  };

  return (
    <div className={styles.container}>
      <button className={styles.floatingButton} onClick={navigateToNewSpace}>
        +
      </button>
    </div>
  );
}
