export default ({ Vue }) => {
    Vue.directive('blur', {
        bind(el, binding) {
            const bindingValue = binding.value;
            if (typeof bindingValue !== 'boolean')
                throw new Error(`Expected directive binding value type to be a boolean but found a ${typeof bindingValue} instead`);
      
            el.style.opacity = bindingValue ? 0.5 : 1;
            el.style.filter = bindingValue ? 'blur(1.5px)' : 'none';
        },
        update(el, binding) {
            const bindingValue = binding.value;
            if (bindingValue === binding.oldValue) return;
            if (typeof bindingValue !== 'boolean')
                throw new Error(`Expected directive binding value type to be a boolean but found a ${typeof bindingValue} instead`);
      
            el.style.opacity = bindingValue ? 0.5 : 1;
            el.style.filter = bindingValue ? 'blur(1.5px)' : 'none';
        }
    });
}
