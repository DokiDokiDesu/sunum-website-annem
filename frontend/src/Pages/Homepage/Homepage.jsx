import { Header } from "../../Components/Header";
import { Incoming } from "./Incoming";
import { Popular } from "./Popular";
import { Voting } from "./Voting";

export function Homepage() {
  return (
    <>
      <Header />
      <Incoming />
      <Popular />
      <Voting />
    </>
  );
}
