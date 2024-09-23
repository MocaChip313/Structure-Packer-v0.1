$(function() {
    $('#submit').on('click', function() {
        var mcpackZip = new JSZip();
        var structureName = document.getElementById('structure_name').value;
        if (structureName == "") {
            alert('Please enter Structure Name.')
        }
        const mcstruture = document.getElementById('mcstructure');
        if (mcstructure.files[0] == null) {
            alert('Please upload mcstructure File.')
        }
        var featureJson = '{"format_version": "1.13.0", "minecraft:structure_template_feature": {"description": {"identifier": "' + structureName + '"}, "structure_name": "mystructure:' + mcstructure.files[0].name.slice(0, length - 12) + '", "adjustment_radius": 0, "facing_direction": "random", "constraints": {"grounded": {}}}}';
        console.log(featureJson);
        mcpackZip.file('features/' + structureName.substr(structureName.indexOf(':') + 1) + '.json', featureJson);
        console.log(structureName.substr(structureName.indexOf(':') + 1) + '.json');
        var biome = document.getElementById('biome').value;
        if (biome == "cave") {
            var biomeFilter = '{"test": "has_biome_tag", "operator": "==", "value": "overworld"}';
            var y_value = '{"extent": [-50, 50], "distribution": "uniform"}';
        }
        else {
            var biomeFilter = '{"test": "has_biome_tag", "operator": "==", "value": "' + biome + '"}';
            var y_value = '"query.above_top_solid(v.worldx, v.worldz)"';
        }
        var iterations = document.getElementById('iterations').value;
        var scatter_chance = document.getElementById('sc').value;
        var featureRuleJson = '{"format_version": "1.13.0", "minecraft:feature_rules": {"description": {"identifier": "' + structureName + '_rule", "places_feature": "' + structureName + '"}, "conditions": {"placement_pass": "surface_pass", "minecraft:biome_filter": [' + biomeFilter + ']}, "distribution": {"scatter_chance": ' + scatter_chance.toString() + ', "coordinate_eval_order": "xyz", "iterations": ' + iterations.toString() + ', "x": {"extent": [0, 15], "distribution": "uniform"},"z": {"extent": [0, 15], "distribution": "uniform"}, "y": ' + y_value + '}}}';
        console.log(featureRuleJson);
        mcpackZip.file('feature_rules/' + structureName.substr(structureName.indexOf(':') + 1) + '_rule.json', featureRuleJson);
        var description = document.getElementById('addon_description').value;
        var packname = document.getElementById('addon_name').value;
        if (packname == "") {
            alert('Please enter Addon Name')
        }
        var manifest = '{"format_version": 2, "header": {"description": "' + description + '","name": "' + packname + '", "uuid": "' + self.crypto.randomUUID() + '", "version": [1, 0, 0], "min_engine_version": [1, 20, 0]}, "modules": [{"type": "data", "uuid": "' + self.crypto.randomUUID() + '", "version": [1, 0, 0]}], "metadata": {"generated_with": {"Structure-Packer": ["1.0.0"]}}}';
        console.log(manifest);
        mcpackZip.file('manifest.json', manifest);
        const packicon = document.getElementById('pack_icon');
        if (structureName == "") {
            alert('Please enter Structure Name.')
        }
            mcpackZip.file('structures/' + mcstruture.files[0].name, mcstructure.files[0]);
            if (packicon.files[0] == null) {
            }
            else {
            mcpackZip.file('pack_icon.png', packicon.files[0]);
            }
            mcpackZip.generateAsync({type:'blob', compression: 'DEFLATE'})
            .then(function(content) {
                const mcpackUrl = (window.URL || window.webkitURL).createObjectURL(content);
                const download = document.createElement('a');
                download.href = mcpackUrl;
                download.download = packname + '.mcpack';
                download.click();
                (window.mcpackUrl || window.webkitURL).revokeObjectURL(mcpackUrl);
            });
    });
});