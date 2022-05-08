<template>
    <div class="harp-button">
        <div>
            <div class="single-pad"></div>
            <div class="single-pad"></div>
            <div class="single-pad"></div>
        </div>
        <div>
            <div v-if="dot" class="single-dot"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HarpButton",
    props: {
        octave: String,
        dot: Boolean,
    },
};
</script>

<style scoped>
.harp-button {

    width: 130px;
    /* display: inline-block; */
}
.single-pad {
    margin-top: 3px;
    margin-bottom: 3px;
    border-radius: 3px;
    background: linear-gradient(to right, #ffa84b, #ffe28c);
    padding: 0;
    width: 120px;
    height: 3px;
}

.single-dot {
    top: -16px;
    margin-top: 3px;
    margin-bottom: 3px;
    border-radius: 3px;
    background: linear-gradient(to right, #feba71, #ffe28c);
    padding: 0;
    width: 3px;
    height: 3px;
    float: right;
    position: relative;
}
</style>
