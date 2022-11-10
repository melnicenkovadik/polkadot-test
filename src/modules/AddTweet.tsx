import {useState} from "react";
import {generateCrustAuthToken, SubsocialApi} from "@subsocial/api";
import {cryptoWaitReady} from "@polkadot/util-crypto";
import {Keyring} from "@polkadot/api";
import {IpfsContent} from "@subsocial/api/substrate/wrappers";

export function AddTweet() {
    const [formDate, setFormData] = useState({
        title: "",
        image: null,
        tags: "",
        body: "",
        canonical: "",
    });

    const setFormValue = (key: string, value: string) => {
        setFormData((prev) => ({...prev, [key]: value}));
    };

    async function createPost() {
        try {
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
            });

            console.log("api", api);
            api.ipfs.setWriteHeaders({
                authorization: "Basic " + authHeader,
            });

            const keyring = new Keyring({type: "sr25519"});
            const pair = keyring.addFromMnemonic(mnemonic);

            const cid = await api.ipfs.saveContent({
                title: formDate.title,
                image: formDate.image,
                tags: formDate.tags,
                body: formDate.body,
                canonical: formDate.canonical,
            });
            const substrateApi = await api.blockchain.api;
            console.log('cid', cid);
            const spaceId = "10327"; // The space in which you're posting.

            const postTransaction = substrateApi.tx.posts.createPost(
                spaceId,
                {RegularPost: null}, // Creates a regular post.
                IpfsContent(cid)
            );
            console.log('postTransaction', postTransaction);
            postTransaction.signAndSend(pair);

            const posts = [
                [spaceId, {RegularPost: null}, IpfsContent(cid)],
                [spaceId, {RegularPost: null}, IpfsContent(cid)],
                // @ts-ignore
            ].map((args) => substrateApi.tx.posts.createPost(...args));
            const batchTx = substrateApi.tx.utility.batch(posts);
            console.log('batchTx', batchTx);
            batchTx.signAndSend(pair);

            setFormData({
                title: "",
                image: null,
                tags: "",
                body: "",
                canonical: "",
            })
        } catch (e) {
            console.log("e", e);
        }
    }

    return (
        <>
            <div className='form'>
                <label htmlFor="title">Title</label>
                <input type="text" id='title' value={formDate.title}
                       onChange={(e) => setFormValue('title', e.target.value)}/>

                <label htmlFor="tags">Tags</label>
                <input type="text" id='tags' value={formDate.tags}
                       onChange={(e) => setFormValue('tags', e.target.value)}/>

                <label htmlFor="body">Body</label>
                <input type="text" id='body' value={formDate.body}
                       onChange={(e) => setFormValue('body', e.target.value)}/>

                <label htmlFor="canonical">Canonical</label>
                <input type="text" id='canonical' value={formDate.canonical}
                       onChange={(e) => setFormValue('canonical', e.target.value)}/>

                <button onClick={createPost}>Create Tween in our APP</button>
            </div>

        </>
    )
}