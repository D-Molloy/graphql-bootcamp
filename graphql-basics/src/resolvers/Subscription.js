const Subscription ={
    // properties in this object have to match up with the Subscription name defined in the schema
    // unlike queries and mutations, the value of the subscription needs to be an object
    // count:{
    //     subscribe(parent, args, {pubsub}, info){
    //         let count = 0;
    //         setInterval(()=> {
    //             count++
    //             // publish - 2 args - 1) name of the channel, an object
    //             pubsub.publish("count", {
    //                 // this has to match up with the subscription type definition
    //                 // name of the subscription and the value returned
    //                 count: count
    //             })
    //         } , 1000)

    //         // asyncIterator creates the "channel" for the scubscription
    //         // arg  - the name of the channel
    //         return pubsub.asyncIterator("count")
    //     }
    // },
    comment:{
        subscribe(parent, {postId}, {db, pubsub}, info){
            const foundPost = db.posts.find(post => post.id === postId && post.published)
            if(!foundPost) {
                throw new Error("Post not found.  Subscription failed.")
            }
            return pubsub.asyncIterator(`comment-${postId}`)
        }
    },
    post:{
        subscribe(parent, args, { pubsub}, info){
            return pubsub.asyncIterator(`new-post`)
        }
    }
}

export {Subscription as default};