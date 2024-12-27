class RegressionRandomTree {
	private maxDepth: any;
	private maxFeatures: any;
	private tree: any;

	constructor(maxDepth = 5, maxFeatures = 3) {
		this.maxDepth = maxDepth;
		this.maxFeatures = maxFeatures;
		this.tree = null;
	}

	mean(array) {
		const sum = array.reduce((sum, item) => sum + item, 0);
		return sum / array.length;
	}

	splitData(data, featureIndex, threshold) {
		const left = [];
		const right = [];

		data.forEach(item => {
			if (item[featureIndex] <= threshold) {
				left.push(item);
			} else {
				right.push(item);
			}
		});

		return { left, right };
	}

	findBestSplit(data) {
		let bestSplit = null;
		let bestError = Infinity;

		const features = Array.from({ length: data[0].length - 1 }, (_, i) => i);

		const numFeatures = Math.min(this.maxFeatures, features.length);

		const selectedFeatures = features.sort(() => 0.5 - Math.random()).slice(0, numFeatures);

		selectedFeatures.forEach(featureIndex => {
			const values = [...new Set(data.map(item => item[featureIndex]))]; // Unique values for the feature

			values.forEach(value => {
				const { left, right } = this.splitData(data, featureIndex, value);

				if (left.length > 0 && right.length > 0) {
					const error = this.computeSquaredError(left, right);
					if (error < bestError) {
						bestError = error;
						bestSplit = {
							featureIndex,
							threshold: value,
							left,
							right,
						};
					}
				}
			});
		});

		return bestSplit;
	}

	computeSquaredError(left, right) {
		const computeError = (subset) => {
			if (subset.length === 0) return 0;

			const mean = subset.reduce((sum, item) => sum + item[item.length - 1], 0) / subset.length;

			return subset.reduce((sum, item) => {
				return sum + Math.pow(item[item.length - 1] - mean, 2);
			}, 0);
		};

		return computeError(left) + computeError(right);
	}

	buildTree(data, depth = 0) {
		if (depth >= this.maxDepth || data.length <= 1) {
			return { value: this.mean(data.map(item => item[item.length - 1])) };
		}

		const bestSplit = this.findBestSplit(data);
		if (!bestSplit) {
			return { value: this.mean(data.map(item => item[item.length - 1])) };
		}

		const { featureIndex, threshold, left, right } = bestSplit;

		return {
			featureIndex,
			threshold,
			left: this.buildTree(left, depth + 1),
			right: this.buildTree(right, depth + 1),
		};
	}

	train(data) {
		// const data = X.map((features, i) => [...features, y[i]]);
		this.tree = this.buildTree(data);
	}

	predict(data) {
		return data.map(item => this.predictSingle(item, this.tree));
	}

	predictSingle(item, node) {
		if (!node.left && !node.right) {
			return node.value;
		}

		if (item[node.featureIndex] <= node.threshold) {
			return this.predictSingle(item, node.left);
		} else {
			return this.predictSingle(item, node.right);
		}
	}
}

export { RegressionRandomTree };
