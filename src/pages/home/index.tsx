import { Header } from "@/components/Header";
import { NavBar } from "@/components/NavBar";
import { UserAvatar } from "@/components/UserAvatar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import HomeImage from "@/assets/home_image.svg";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { CardDescription } from "@/components/CardDescription";
import { useEffect, useState } from "react";
import { AllSpaces } from "@/utils/types";
import { getSpaces } from "@/services/api/space";
import { Page } from "@/components/Page";
import { Text } from "@/components/Text";
import Loading from "@/components/Loading";

export default function Home() {
  const router = useRouter();
  const [cards, setCards] = useState<AllSpaces>([]);
  const [spaces, setSpaces] = useState<AllSpaces>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  useEffect(() => {
    getSpaces().then((response) => {
      setLoading(false);
      setSpaces(response.sort((a, b) => b.id - a.id));
    });
  }, []);

  useEffect(() => {
    const updatedCards = spaces.slice(0, 3);
    setCards(updatedCards);
  }, [spaces]);

  const navigateToListSpace = () => {
    router.push("/spaces");
  };

  const navigateToDetailsSpace = (id: number) => {
    router.push(`/space/${id}`);
  };

  return (
    <>
      <Header>
        <NavBar />
        <UserAvatar />
      </Header>
      <Page>
        <div className={styles.container}>
          <Image
            src={HomeImage}
            alt="RentSpace Logo"
            style={{ filter: "brightness(0.5)" }}
          />
          <div className={styles.overlayText}>
            <div className={styles.titleContainer}>
              <span className={styles.eventPhrase}>Vamos organizar esse</span>
              <span className={styles.eventPhraseBold}>EVENTO ?</span>
            </div>
            <div className={styles.subtitleContainer}>
              <span className={styles.subtitle}>
                Seja bem-vindo! Estamos aqui para oferecer as principais
                necessidades para que você tenha o evento perfeito sem qualquer
                preocupação!
              </span>
            </div>
          </div>
        </div>

        <div className={styles.spacesContainter}>
          <div className={styles.spaces}>
            <div className={styles.textContainer}>
              <Text size="title1" weight="semibold">
                Principais Espaços
              </Text>
              <button className={styles.seeAll} onClick={navigateToListSpace}>
                Ver todos
              </button>
            </div>

            <div className={styles.cardContainer}>
              {loading
                ? Array.from(Array(3).keys()).map((_, i) => (
                    <div
                      className={`${styles.cards} ${styles.loadingCard}`}
                      key={i}
                    >
                      <Loading key={i} loadingLabel="Carregando..." />
                    </div>
                  ))
                : cards.map((card, _) => {
                    return (
                      <div className={styles.cards} key={card.id}>
                        <CardDescription
                          key={card.id}
                          title={card.title}
                          maxCapacity={card.maximumCapacity}
                          image={card.media?.length ? card.media[0] : ""}
                          pricePerHour={card.pricePerHour}
                          onClick={() => navigateToDetailsSpace(card.id)}
                          description={card.description}
                        />
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
