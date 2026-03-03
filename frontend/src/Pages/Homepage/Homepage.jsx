import { Header } from "../../Components/Header";
import { Incoming } from "./Incoming";
import { Popular } from "./Popular";
import { Voting } from "./Voting";
import { HeroComp } from "./HeroComp";
import { Footer } from "../../Components/Footer";

export function Homepage() {
  return (
    <>
      <Header />
      <HeroComp />
      <Incoming />
      <Popular />
      <Voting />
      <Footer />
    </>
  );
}
