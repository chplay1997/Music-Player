/**
         * 1. Render songs
         * 2. Scoll top
         * 3. Play / Pause / Seek
         * 4. CD rotate
         * 5. Next / prev
         * 6. Random
         * 7. Next / repeat when ended
         * 8. Active song
         * 9. Scroll Active song into view
         * 10. Play song when click
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');



const app = {
    currentIndex: 0,
    isPlaying: false,
    songs : [
        {
            name: 'Tiếc Duyên',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/1_tiec_duyen.mp3",
            image: './assets/image/anh1.jpg'
        },
        {
            name: 'Ai Thật Lòng Thương Em',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/2.Ai_that_long_thuong_em.mp3",
            image: "./assets/image/anh2.jpg"
        },
        {
            name: 'Tết Bình An',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/3.TEt_binh_an.mp3",
            image: "./assets/image/anh3.jpg"
        },
        {
            name: 'Như Bến Đợi Đò',
            singer: 'Hana Cẩm Tiên',
            path: "./assets/music/4.Nhu_ben_doi_lo.mp3",
            image: "./assets/image/anh4.jpg"
        },
        {
            name: 'Thành Cổ Tình Yêu',
            singer: 'Hứa Tiêu Nhi',
            path: "./assets/music/5.thanh_co_tinh_yeu.mp3",
            image: "./assets/image/anh5.jpg"
        },
        {
            name: 'Viên Đạn Phiêu Dạt',
            singer: 'Kiều Mini',
            path: "./assets/music/6.vien_dan_phieu_dat.mp3",
            image: "./assets/image/anh6.jpg"
        },
        {
            name: 'Cô Đơn Sẽ Tốt Hơn',
            singer: 'Kiều Mini',
            path: "./assets/music/7.co_don_se_tot_hon.mp3",
            image: "./assets/image/anh7.jpg"
        },
        {
            name: 'Cheer Up',
            singer: 'Hong Jin Young',
            path: "./assets/music/8.Cheer_up.mp3",
            image: "./assets/image/anh8.jpg"
        },
        {
            name: 'Vĩnh Biệt Màu Xanh Remix',
            singer: 'Phương Phương Thảo',
            path: "./assets/music/9.vinh_biet_mau_xanh.mp3",
            image: "./assets/image/anh9.jpg"
        },
        {
            name: 'Ngỡ Như Là Giấc Mơ',
            singer: 'Duyên Bún',
            path: "./assets/music/10.ngo_nhu_la_giac_mo.mp3",
            image: "./assets/image/anh10.jpg"
        }
    ],
    render:function(){
        const htmls =this.songs.map(song =>{
            return `
            <div class="song">
                <div class="thumb"
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML =htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý phóng to / thu nhỏ CD
        document.onscroll  = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px':0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        //Khi song được play
        audio.onplay = function() {
            _this.isPlaying =true;
            player.classList.add('playing');
        }
        //Khi song bị pause 
        audio.onpause = function() {
            _this.isPlaying =false;
            player.classList.remove('playing');
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor( (audio.currentTime / audio.duration )*100);
                progress.value = progressPercent;
            }
        }
        //Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = (e.target.value)*audio.duration/100;
            audio.currentTime =seekTime;
        }
    },
    loadCurrentSong: function() {
        heading.textContent =this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start: function() {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //lắng nghe /xử lý các sự kiện (DOM events)
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();
    }
}
app.start();
