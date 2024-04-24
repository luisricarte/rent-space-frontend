import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NavBar } from "@/components/NavBar";
import { UserAvatar } from "@/components/UserAvatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CardDescription } from "@/components/CardDescription";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import styles from "./styles.module.css";
import { FloatingButton } from "@/components/FloatingButton";
import { useEffect, useState } from "react";
import { getSpaces } from "@/services/api/space";
import { AllSpaces } from "@/utils/types";

const PAGE_SIZE = 6;

export default function Spaces() {
  const [spaces, setSpaces] = useState<AllSpaces>([]);
  const [cards, setCards] = useState<AllSpaces>([]);

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(spaces.length / PAGE_SIZE);
  const router = useRouter();

  useEffect(() => {
    getSpaces().then((response) => setSpaces(response));
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const updatedCards = spaces
      .slice(startIndex, endIndex)
      .sort((a, b) => a.title.localeCompare(b.title));

    setCards(updatedCards);
  }, [page, spaces]);

  const goToPreviousPage = () => {
    if (page > 1) {
      return setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (totalPages > page) {
      return setPage(page + 1);
    }
  };

  const navigateToDetailsSpace = (id: number) => {
    router.push(`/space/${id}`);
  };

  useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  return (
    <>
      <Header>
        <NavBar />
        <UserAvatar />
      </Header>

      <FloatingButton />
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>Espaços para alugar</span>
        </div>

        <div className={styles.listContainer}>
          {cards.map((card, i) => {
            return (
              <div className={styles.card} key={i}>
                <CardDescription
                  key={card.id}
                  title={card.title}
                  maxCapacity={card.maximumCapacity}
                  description={card.description}
                  image={card.media?.length ? card.media[0] : ""}
                  pricePerHour={card.pricePerHour}
                  onClick={() => navigateToDetailsSpace(card.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <Footer justify="center" className={styles.footer}>
        <SlArrowLeft
          className={styles.footerArrow}
          onClick={goToPreviousPage}
        />
        <div className={styles.footerPage}>
          {Array.from({ length: totalPages }).map((_, indice) => {
            return (
              <>
                {page == indice + 1 ? (
                  <span className={styles.currentPage}>{`${indice + 1} `}</span>
                ) : (
                  <span>{`${indice + 1} `}</span>
                )}
              </>
            );
          })}
        </div>
        <SlArrowRight className={styles.footerArrow} onClick={goToNextPage} />
      </Footer>
    </>
  );
}
