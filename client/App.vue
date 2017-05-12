<template>
    <div id="app">
        <p>
            <router-link to="/foo">Foo</router-link>
            <router-link to="/foo2">Foo 2</router-link>
        </p>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    // empty
}
</script>
