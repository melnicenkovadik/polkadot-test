import { useEffect, useState } from "react";
import { SubsocialApi, generateCrustAuthToken } from "@subsocial/api";
import { IpfsContent } from "@subsocial/api/substrate/wrappers";
import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";

export function HomePage(props: any) {
  const [tweets, setTweets] = useState([]);
  const [selectedTweets, setSelectedTweets] = useState<
    Array<{
      id: number;
      title: string;
      body: string;
    }>
  >([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => setTweets(json));
  });

  function selectTweet(tweet: { id: number; title: string; body: string }) {
    setSelectedTweets((prev) => {
      if (prev.find((t) => t.id === tweet.id)) {
        return prev.filter((t) => t.id !== tweet.id);
      } else {
        return [...prev, tweet];
      }
    });
  }

  async function sendSelectedTweets() {
    try {
      const tweetsToSend = selectedTweets.map((t) => ({
        title: t.title,
        image: null,
        tags: "tweeter ",
        body: t.body,
        canonical: "",
      }));
      const mnemonic =
        "endorse index believe hybrid orbit squeeze spatial spare popular suggest sock category";
      const authHeader = generateCrustAuthToken(mnemonic);

      const substrateNodeUrl = "wss://para.f3joule.space";

      const ipfsNodeUrl = "https://crustwebsites.net";

      await cryptoWaitReady();

      const api = await SubsocialApi.create({
        offchainUrl: "",
        useServer: undefined,
        substrateNodeUrl,
        ipfsNodeUrl,
      } as any);

      api.ipfs.setWriteHeaders({
        authorization: "Basic " + authHeader,
      });

      const keyring = new Keyring({ type: "sr25519" });

      const pair = keyring.addFromMnemonic(mnemonic);

      const spaceId = "10327"; // The space in which you're posting.

      const posts = tweetsToSend.map((tweet) => {
        return api.ipfs.saveContent(tweet).then((cid) => {
          return [spaceId, { RegularPost: null }, IpfsContent(cid)];
        });
      });

      const postsWithCids = await Promise.all(posts);

      const substrateApi = await api.blockchain.api;

      const postTransactions = postsWithCids.map((args) =>
          // @ts-ignore
          substrateApi.tx.posts.createPost(...args)
      );

      const batchTx = substrateApi.tx.utility.batch(postTransactions);

      batchTx.signAndSend(pair);

      setSelectedTweets([]);
    } catch (e) {
      console.log("e", e);
    }
  }

  function unselectHandler() {
    setSelectedTweets([]);
  }

  return (
    <div className="app">
      {selectedTweets?.length > 0 ? (
        <div className="selected-options">
          <div onClick={unselectHandler} className="selected-option">
            unselect ({selectedTweets?.length})
          </div>
          <div onClick={sendSelectedTweets} className={"selected-option"}>
            send to our platform
          </div>
        </div>
      ) : null}
      <div className="tweets">
        {tweets.map((tweet: any) => (
          <div
            className={`tweet ${
              selectedTweets.find((t) => t.id === tweet.id)
                ? "selected tweet"
                : "tweet"
            }`}
            key={tweet.id}
            onClick={() => selectTweet(tweet)}
          >
            <h3>{tweet.title}</h3>
            <p>{tweet.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
