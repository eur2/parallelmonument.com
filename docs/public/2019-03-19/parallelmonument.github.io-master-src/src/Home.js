import React from 'react';
import Firebase from 'firebase/app';
import 'firebase/database';
import './firebase.js';
import Modal from './components/Modal';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import icon from './components/marker.svg';
const GM_API_KEY = `${process.env.REACT_APP_GM_API_KEY}`;

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      developers: [],
      mapClick: false,
      mapClickLat: '',
      mapClickLng: '',
      modalOpen: false,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      lang: 'fr',
      mapType: 'terrain'
    };
  }

  componentDidMount() {
    this.getUserData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state.developers) {
      this.writeUserData();
    }
  }

  writeUserData = () => {
    Firebase.database()
      .ref('/developers')
      .set(this.state.developers);
    //console.log("DATA SAVED");
  };

  getUserData = () => {
    let ref = Firebase.database().ref('/');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState(state);
      //console.log(state);
    });
  };

  handleClose = () => {
    this.setState({
      modalOpen: false,
      mapClick: false
    });
  };
  onChange = coord => {
    const { latLng } = coord;
    this.setState({
      mapClickLat: latLng.lat(),
      mapClickLng: latLng.lng()
    });
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  onMapClick = (props, marker, coord) => {
    const { latLng } = coord;
    this.setState({
      mapClick: true,
      mapClickLat: latLng.lat(),
      mapClickLng: latLng.lng(),
      modalOpen: true
    });
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };
  onMapTypeSat = () => {
    this.setState({
      mapType: 'satellite'
    });
  };
  onMapTypeTerrain = () => {
    this.setState({
      mapType: 'terrain'
    });
  };
  onLangFr = () => {
    this.setState({
      lang: 'fr'
    });
  };
  onLangEn = () => {
    this.setState({
      lang: 'en'
    });
  };
  /*onClick(t, map, coord) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    console.log(lat);
    console.log(lng);
  }*/
  handleSubmit = event => {
    event.preventDefault();
    let lat = parseFloat(this.refs.lat.value);
    let lng = parseFloat(this.refs.lng.value);
    let name = this.refs.name.value;
    let title = this.refs.title.value;
    let role = this.refs.role.value;
    let uid = this.refs.uid.value;

    if (uid && name && title && role && lat && lng) {
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.uid === uid;
      });
      developers[devIndex].lat = lat;
      developers[devIndex].lng = lng;
      developers[devIndex].name = name;
      developers[devIndex].title = title;
      developers[devIndex].role = role;
      this.setState({ developers });
    } else if (lat && lng && name && title && role) {
      const uid = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ lat, lng, uid, name, title, role });
      this.setState({ developers });
    }

    this.refs.lat.value = '';
    this.refs.lng.value = '';
    this.refs.name.value = '';
    this.refs.title.value = '';
    this.refs.role.value = '';
    this.refs.uid.value = '';
    this.setState({
      modalOpen: false
    });
  };

  static defaultProps = {
    center: {
      lat: 48.8989,
      lng: 2.3444
    },
    zoom: 14
  };

  render() {
    const {
      developers,
      modalOpen,
      mapClick,
      mapClickLat,
      mapClickLng,
      lang,
      mapType
    } = this.state;

    return (
      <div className={mapType === 'terrain' ? 'map' : null}>
        <header>
          <Modal
            title={<h1 className="button">Parallel Monument</h1>}
            content={
              lang === 'fr' ? (
                <div className="content">
                  <h3>
                    Parallel Monument est un acte d’écriture collective qui
                    archive et géolocalise dans l’espace de la ville les
                    célébrations, luttes et mobilisations qui ont façonné
                    l’identité d’un lieu, de ses habitants et l’imaginaire d’un
                    coin de ville sans pour autant faire l’objet d’une
                    commémoration officielle.
                  </h3>
                  <br />
                  <p>
                    Parallel Monument est un projet lauréat du programme FAIRE,
                    lancé par le{' '}
                    <a
                      href="http://www.pavillon-arsenal.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pavillon de l’Arsenal
                    </a>{' '}
                    et développé par{' '}
                    <a
                      href="https://martinezbaratlafore.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MBL architectes
                    </a>{' '}
                    : Sebastien Martinez-Barat, Benjamin Lafore, Robin Durand,
                    Véranie Jeune avec Florian Jomain,{' '}
                    <a
                      href="http://www.uho.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Max Thurnheim
                    </a>{' '}
                    et{' '}
                    <a
                      href="https://eurogroupe.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Eurogroupe
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <div className="content">
                  <h3>
                    Parallel Monument is an act of collective writing which
                    archives and locates in the space of the city the memories,
                    struggles and engagements that have shaped the identity, the
                    stories of a place, of its inhabitants, all this without
                    official representation.
                  </h3>
                  <br />
                  <p>
                    Parallel Monument is a winning project of the FAIRE program,
                    launched by the{' '}
                    <a
                      href="http://www.pavillon-arsenal.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pavillon de l’Arsenal
                    </a>{' '}
                    and developed by{' '}
                    <a
                      href="https://martinezbaratlafore.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MBL architects
                    </a>{' '}
                    : Sebastien Martinez-Barat, Benjamin Lafore, Robin Durand,
                    Véranie Jeune with Florian Jomain,{' '}
                    <a
                      href="http://www.uho.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Max Thurnheim
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://eurogroupe.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Eurogroupe
                    </a>
                    .
                  </p>
                </div>
              )
            }
          />
        </header>
        <nav>
          <Modal
            title={<h2>+</h2>}
            content={
              lang === 'fr' ? (
                <div className="content">
                  <h3>
                    1. Les Parallel Monuments existent sous forme d’information
                    sur le calque virtuel du monde.
                    <br />
                    2. Les Parallel Monuments commémorent un évènement et son
                    inscription dans l’espace.
                    <br />
                    3. Les Parallel Monuments sont des signes de mémoires
                    partagées et adressent à d’autres leur désir d’exister.
                    <br />
                    <br />
                    Célébration, lutte et mobilisation
                    <br />
                    Les Parallel Monuments composent ensemble une géographie de
                    la mémoire en marge des mémoires officielles.
                    <br />
                    <br />
                    Modération
                    <br />
                    Les Parallel Monuments sont modérés afin de s'assurer
                    qu'aucun contenu haineux ne soit ajouté sur la plate-forme.
                    Si vous repérez un Parallel Monument que vous pensez devoir
                    être supprimé, ou si vous souhaitez qu’un Parallel Monument
                    que vous avez créé soit supprimé, contactez-nous.
                    <br />
                    <br />
                    Contact
                    <br />
                    <a href="mailto:parallelmonument@gmail.com">
                      parallelmonument@gmail.com
                    </a>
                  </h3>
                </div>
              ) : (
                <div className="content">
                  <h3>
                    1. The Parallel Monuments exist as information on the
                    virtual layer of the world. <br />
                    2. The Parallel Monuments commemorate an event and its
                    inscription in space. <br />
                    3. The Parallel Monuments are signs of shared memories and
                    address their desire to exist to others. <br /> <br />
                    Celebration, struggle and mobilization <br />
                    The Parallel Monument together compose a geography of memory
                    on the margins of official memories. <br /> <br />
                    Moderation <br />
                    Parallel Monuments are moderated to ensure that no hate
                    commercial content is added to the platform. If you see a
                    Parallel Monument that you think should be deleted, or if
                    you want a Parallel Monument that you have created or
                    deleted, contact us.
                    <br /> <br />
                    Contact <br />
                    <a href="mailto:parallelmonument@gmail.com">
                      parallelmonument@gmail.com
                    </a>
                  </h3>
                </div>
              )
            }
          />
        </nav>
        <div className="lang">
          <button
            onClick={this.onMapTypeTerrain}
            className={mapType === 'terrain' ? 'current' : null}
          >
            {lang === 'fr' ? 'Plan' : 'Map'}
          </button>
          <button
            onClick={this.onMapTypeSat}
            className={mapType === 'satellite' ? 'current' : null}
          >
            Satellite
          </button>
          <button
            onClick={this.onLangFr}
            className={lang === 'fr' ? 'current' : null}
          >
            FR
          </button>
          <button
            onClick={this.onLangEn}
            className={lang === 'en' ? 'current' : null}
          >
            EN
          </button>
          <button
            className="social"
            onClick={() => {
              window.location.href = 'https://www.facebook.com/';
            }}
          >
            <svg
              id="Calque_1"
              data-name="Calque 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1536 1536"
            >
              <title>facebook-square-white</title>
              <path
                d="M1376,128q119,0,203.5,84.5T1664,416v960q0,119-84.5,203.5T1376,1664H1188V1069h199l30-232H1188V689q0-56,23.5-84t91.5-28l122-1V369q-63-9-178-9-136,0-217.5,80T948,666V837H748v232H948v595H416q-119,0-203.5-84.5T128,1376V416q0-119,84.5-203.5T416,128h960Z"
                transform="translate(-128 -128)"
              />
            </svg>
          </button>
          <button
            className="social"
            onClick={() => {
              window.location.href =
                'https://www.instagram.com/parallelmonument/';
            }}
          >
            <svg
              aria-labelledby="simpleicons-instagram-icon"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title id="simpleicons-instagram-icon">Instagram icon</title>
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
          </button>
        </div>

        {modalOpen ? (
          <form onSubmit={this.handleSubmit} className="form border">
            <div className="latlng">
              <div className="border">
                <input
                  type="text"
                  ref="lat"
                  value={mapClickLat}
                  onChange={this.onChange}
                />
              </div>
              <div className="border">
                <input
                  type="text"
                  ref="lng"
                  value={mapClickLng}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div>
              <button onClick={this.handleClose} className="close">
                ×
              </button>
            </div>
            <div className="form-row">
              <input type="hidden" ref="uid" />
              <div>
                <label>{lang === 'fr' ? 'Qui' : 'Who'}</label>
                <input
                  type="text"
                  ref="name"
                  placeholder={lang === 'fr' ? 'Votre nom' : 'Your name'}
                  pattern=".+"
                />
              </div>
              <div>
                <label>{lang === 'fr' ? 'Quand' : 'When'}</label>
                <input
                  type="text"
                  ref="title"
                  placeholder={lang === 'fr' ? 'JJ/MM/AAAA' : 'DD/MM/YYYY'}
                  pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                />
              </div>
              <div>
                <label>{lang === 'fr' ? 'Quoi' : 'What'}</label>
                <textarea
                  type="text"
                  ref="role"
                  placeholder={lang === 'fr' ? 'Votre texte' : 'Your text'}
                  pattern=".+"
                />
              </div>
            </div>
            <div>
              <button type="submit" className="close">
                {lang === 'fr' ? 'Enregistrer' : 'Save'}
              </button>
            </div>
          </form>
        ) : null}

        <Map
          key={mapType}
          style={{
            height: '100%',
            width: '100%',
            cursor: 'pointer'
          }}
          google={this.props.google}
          onClick={this.onMapClick}
          zoom={this.props.zoom}
          initialCenter={this.props.center}
          styles={[
            {
              featureType: 'all',
              stylers: [{ saturation: -100 }]
            },
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }]
            }
          ]}
          mapTypeControl={false}
          fullscreenControl={false}
          streetViewControl={false}
          panControl={false}
          rotateControl={false}
          mapType={mapType}
        >
          {mapClick ? (
            <Marker
              position={{ lat: mapClickLat, lng: mapClickLng }}
              icon={icon}
            />
          ) : null}
          {developers.map(developer => (
            <Marker
              onClick={this.onMarkerClick}
              key={developer.uid}
              position={{ lat: developer.lat, lng: developer.lng }}
              title={developer.title}
              txt={developer.role}
              name={developer.name}
              icon={icon}
            />
          ))}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div className="infowindow">
              <p>{this.state.selectedPlace.name}</p>
              <p style={{ textAlign: 'center' }}>
                {this.state.selectedPlace.title}
              </p>
              <p>{this.state.selectedPlace.txt}</p>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: GM_API_KEY
})(Home);
