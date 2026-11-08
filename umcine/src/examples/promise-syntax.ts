// 2.2 실습: .then().catch()와 async/await 비교 (main.tsx에 임시로 import해서 실행)
function getMovieTitle(): Promise<string> {
  return Promise.resolve("인셉션");
}

function loadWithThen() {
  return getMovieTitle()
    .then((title) => console.log(`.then(): ${title}`))
    .catch((error) => console.error(error));
}

async function loadWithAsyncAwait() {
  try {
    const title = await getMovieTitle();
    console.log(`async/await: ${title}`);
  } catch (error) {
    console.error(error);
  }
}

loadWithThen();
loadWithAsyncAwait();
