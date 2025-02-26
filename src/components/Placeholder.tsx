

function Box({ width, height }: {width: string, height: string}) {
	return <div className="mt-2 bg-gray-700 rounded-full" style={{ width, height }} />
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
	return <div>
		<Box width="50%" height="2rem" />
		<Box width="30%" height="1rem" />
		<Box width="70%" height="1rem" />
		<Box width="40%" height="1rem" />
	</div>
}