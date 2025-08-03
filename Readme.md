# FunnyOrFud

A opinion market for memes! Create templates, create memes, and, give your opinions on them on our platform, and take part in mutual trades between peers.


## Problem it solves

### INTRO
Meme coins this, meme coins that when was the last time meme coins were actually funny? Except when looking at your portfolio. 
Through the hot topic of memes, and, coins in the web3 space I want to solve the problem of rug pulls, no real community, and most of all cater to the degen -meme community. The problem with the current meme platforms like img-flip, 9 gag, pump.fun are that they aren't incentivizing creative individuals and risk-takers enough.  

### ABOUT IT
FunnyOrFud lies at the intersection of the current user market - An for-all platform with meme templates, meme creation, an editor, the incentive for users, and validation of humor all in one place. 

### USERS
It caters to three types of people in the community:
1. Meme Template Creators: The foreseers of the future who take a shot at the potential of a meme template and create it. 
2. Meme creators: The legacy carriers, that carry the legacy of the meme template and add context to make them funnier or opinionated. 
3. Meme Consumers: Normal people who want to find funny memes, looking to scroll through memes by templates. They will be able to take part in the Opinion market of meme-templates.

### REWARD MECHANISM
The meme and meme-template creators get rewarded for the engagement they produce whereas the consumers get rewarded for the risk they take.

### UX SYSTEM
I kept the UX simple, with a relayer that would allow users to right swipe to say a meme was Funny, Left Swipe to say it wasn't funny, and swipe up to ignore it. 
With a resolution period of 6 hours, after which the majority of voters win and get rewarded.


## Challenges we ran into

1. Faced a major challenge when tried integrating with the Onchainkit SDK the Chain Networks kept breaking and we weren't able to figure it out at all so had to leave it and revert to basic metamask.
2. Problem with Akave: Local docker deployment was an issue as well as the file structure being different from IPFS. In the midst of figuring it out we lost a lot of time and had to shift to Walrus storage.

These were the major blockers that we faced and caused a big hurdle where we had to find a work around for it.
Apart from these there were several problems like the wagmi version exploding in the console.log, and small changes in SDK not displayed in the documentation.

