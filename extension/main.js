// async function countBookmarks(){

//   // This part recursively checks for all existing childrens and updates count to total number of bookmarks
//   function logItems(bookmarkItem) {
//     if (bookmarkItem.url) {
//       count++;
//     }
//     if (bookmarkItem.children) {
//       for (child of bookmarkItem.children) {
//         logItems(child);
//       }
//     }
//   }
  
//   function logTree(bookmarkItems) {
//     logItems(bookmarkItems[0]);
//   }
 
//   let gettingTree = await browser.bookmarks.getTree();

//   // handling error
//   try {
//     logTree(gettingTree)
//     return count
//   } catch (error) {
//     return error
//   }
// }

// async function getBookmarks(index){
//   var arrayOfBookmarks = [];

//   let recents = await browser.bookmarks.getRecent(index) // example ke liye 10 deh diye
//   for (let i = 1; i < recents.length; i++) {
//     let bookmark = recents[i];
//     let parentInfo = await browser.bookmarks.get(bookmark.parentId)
//     let temp = {
//       name: bookmark.title,
//       url: bookmark.url,
//       topic: parentInfo[0].title
//     }
//     arrayOfBookmarks.push(temp)
//   } 
//   return arrayOfBookmarks
// }


async function getBookmarks(){
  let bookmarksObject = {}
  async function logItems(bookmarkItem) {
    if (bookmarkItem.url) {
      let temp = {
        name: bookmarkItem.title,
        url: bookmarkItem.url,
      }
      let parentInfo = await browser.bookmarks.get(bookmarkItem.parentId)
      if(bookmarksObject[parentInfo[0].title] == undefined){
        bookmarksObject[parentInfo[0].title] = []
        bookmarksObject[parentInfo[0].title].push(temp)
      }else{
        bookmarksObject[parentInfo[0].title].push(temp)
      }
    }
    if (bookmarkItem.children) {
      for (child of bookmarkItem.children) {
        logItems(child);
      }
    }
  }
  
  function logTree(bookmarkItems) {
    logItems(bookmarkItems[0]);
  }
  
  function onRejected(error) {
    console.log(`An error: ${error}`);
  }
  
  let gettingTree = browser.bookmarks.getTree();
  gettingTree.then(logTree, onRejected);

  return bookmarksObject
  
}

async function postReq(path, data){
  const response = await fetch(`localhost:9999/${path}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function handleBookmarkEvent() {

  // // sending bookmarks
  // let totalBookmarks = await countBookmarks();
  // let result = await getBookmarks(totalBookmarks)
  // let response = await postReq("sendBookmarks",result)
  // console.log(response)

  let result = await getBookmarks()
  let response = await postReq("sendBookmarks",result)
  console.log(response)
}

// This will run when a bookmark is created.
browser.bookmarks.onCreated.addListener(
  handleBookmarkEvent
);