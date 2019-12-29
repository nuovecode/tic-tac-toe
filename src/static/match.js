class Match {

  /**
   * Poor browser support
   * TODO: should be transplied
   */

  constructor(turn, slug) {

    this.turn = turn

    this.slug = slug

    this.baseUrl = window.location.origin

    this.handleEventListeners()

  }

  getData(path) {
    return fetch(this.baseUrl + path).then((response) =>{
      return response.json();
    })
  }

  postData(path, body) {
    return fetch(this.baseUrl + path, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then((response) =>{
      return response.json();
    })
  }

  handleEventListeners() {
    document.addEventListener('click',  (e) => {
      switch (e.target.className) {
        case 'box':
          let body = {slug: this.slug, box: e.target.getAttribute('data-box'), player: this.turn}
          this.postData('/V1/move', body).then((response) => {
            console.log(response)
            if (response.status === 'ok') {
              e.target.innerHTML = 'Player ' + this.turn
              if (response.winner) {
                document.getElementById('turn').innerHTML = response.turn;
              } else {
                document.getElementById('winner').innerHTML = response.winner;
              }
            }
          })
          break;

      }
    }, false);
  }

}

