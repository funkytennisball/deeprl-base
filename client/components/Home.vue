<template>
    <div>
        <h3>Classic Control</h3>
        <div class="gallery">
            <router-link to="/cartpole" class="item">
                <img :src="images.cartpole" />
                <div class="item-title">Cartpole-v0</div>
            </router-link>
        </div>
        <h3>Board Games</h3>
        <div class="gallery">
            <div class="item">
                <img :src="images.image2048" />
                <div class="item-title">2048</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            images: {
                cartpole: require('../assets/cartpole.png'),
                image2048: require('../assets/2048.png')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$block-width: 150px;

.gallery {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
}

.gallery>.item {
    cursor: pointer;
    margin: 10px;
    padding: 10px;
    flex-basis: $block-width;
}

.gallery>.item:hover {
    padding: 9px;
    border: 1px solid grey;
}

.gallery>.item>img {
    flex-basis: $block-width;
    max-width: 100%;
    display: block;
}

.gallery>.item>.item-title {
    text-align: center;
}
</style>