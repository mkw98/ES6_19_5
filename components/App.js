//App — wszystko wiąże w jeden byt. W tym komponencie będziemy odbierać wiadomość 
//z komponentu zajmującego się wyszukiwaniem (search)i przekazywać do komponentu, 
//który wyświetli odpowiedniego gifa (gif.js)

App = React.createClass({
    //render: function() {
         getInitialState() {
            return {
                loading: false,
                searchingText: '',
                gif: {}
        };
    },
 //poprzedni kod
 //      handleSearch: function(searchingText) {  // 1.
 //   this.setState({
 //     loading: true  // 2.
 //   });
 //   this.getGif(searchingText, function(gif) {  // 3.
 //     this.setState({  // 4
 //       loading: false,  // a
 //       gif: gif,  // b
 //       searchingText: searchingText  // c
 //     });
 //   }.bind(this));
 // },

    handleSearch: function(searchingText) { // 1.
        this.setState({
            loading: true // 2.
        });
        this.getGif(searchingText).then(gif => { 
            this.setState({ 
                loading: false, 
                gif: gif, 
                searchingText: searchingText 
            });
        })
        .catch(error => console.log('Error!', error));
    },

getGif: function(searchingText, callback) { // 1.
    var GIPHY_PUB_KEY = 'vYDHC2Ex4rf6H5D4DGUmOukTGEXa95h5';  //czy te klucze tutaj?
    var GIPHY_API_URL = "https://api.giphy.com";

    var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // Konstruujemy adres URL dla API Giphy
     return new Promise(
       function(resolve, reject) {
            const request = new XMLHttpRequest();
            request.onload = function() {
                if (this.status === 200) { //this? czy request?
                    var data = JSON.parse(request.responseText).data; // // W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie do zmiennej data, aby nie pisać za każdym razem response.data.
                    var gif = {  // Układamy obiekt gif na podstawie tego, co otrzymaliśmy z serwera
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                    };
                    resolve(gif); // spelnienie obietnicy - zamiast callback
                } else {
                    reject(new Error(this.statusText)); // obietnica "nie została spełniona" - błąd
                }
            };
            request.onerror = function() {
                reject(new Error(
                   `XMLHttpRequest Error: ${this.statusText}`));
            };
          request.open('GET', url);
            request.send();
        });
},
//poprzedni kod:
//var xhr = new XMLHttpRequest();  // 3.
    //xhr.open('GET', url);
    //xhr.onload = function() {
    //    if (xhr.status === 200) {
    //       var data = JSON.parse(xhr.responseText).data; // W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie do zmiennej data, aby nie pisać za każdym razem response.data.
     //       var gif = {  // Układamy obiekt gif na podstawie tego, co otrzymaliśmy z serwera
     //           url: data.fixed_width_downsampled_url,
     //           sourceUrl: data.url
     //       };
     //       callback(gif);  // Przekazujemy obiekt do funkcji callback, którą przekazaliśmy jako drugi parametr metody getGif
     //   }
    //};
    //xhr.send();
//},
            render: function() {

            var styles = {
                margin: '0 auto',
                textAlign: 'center',
                width: '90%'
            };
        return (
          <div style={styles}>
                <h1>Wyszukiwarka GIFów!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
            <Gif
            loading={this.state.loading}
            url={this.state.gif.url}
            sourceUrl={this.state.gif.sourceUrl}
            />
          </div>
        );
    }
 
});




    
