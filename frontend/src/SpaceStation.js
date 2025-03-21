import React, { useRef, useEffect } from "react";

const SpaceStation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = 600;
        canvas.height = 600;

        const TORUS_RADIUS = 150; // Radius of the torus
        const TUBE_RADIUS = 60;  // Radius of the tube
        const SEGMENTS = 32;     // Number of tube segments
        const RINGS = 64;        // Number of rings around the torus
        const COLORS = ["#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#00FFFF"]; // Color gradients
        const ROTATION_SPEED = 0.02;

        let rotationX = 0;
        let rotationY = 0;

        function drawTorus() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            for (let i = 0; i < RINGS; i++) {
                const theta = (i / RINGS) * Math.PI * 2; // Angle for the ring
                const ringX = TORUS_RADIUS * Math.cos(theta);
                const ringY = TORUS_RADIUS * Math.sin(theta);

                for (let j = 0; j < SEGMENTS; j++) {
                    const phi = (j / SEGMENTS) * Math.PI * 2; // Angle for the tube
                    const x = (TORUS_RADIUS + TUBE_RADIUS * Math.cos(phi)) * Math.cos(theta);
                    const y = (TORUS_RADIUS + TUBE_RADIUS * Math.cos(phi)) * Math.sin(theta);
                    const z = TUBE_RADIUS * Math.sin(phi);

                    // Rotate the torus
                    const rotatedX = x * Math.cos(rotationY) - z * Math.sin(rotationY);
                    const rotatedZ = x * Math.sin(rotationY) + z * Math.cos(rotationY);

                    const finalX = rotatedX * Math.cos(rotationX) - y * Math.sin(rotationX);
                    const finalY = rotatedX * Math.sin(rotationX) + y * Math.cos(rotationX);

                    const size = Math.max(0.5, 2 + rotatedZ / 100);

                    // Choose gradient color
                    const colorIndex = Math.floor((j / SEGMENTS) * COLORS.length);
                    ctx.fillStyle = COLORS[colorIndex];
                    ctx.beginPath();
                    ctx.arc(finalX, finalY, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();
        }

        function animate() {
            rotationX += ROTATION_SPEED * 0.5;
            rotationY += ROTATION_SPEED;
            drawTorus();
            requestAnimationFrame(animate);
        }

        animate(); // Start animation

        return () => {
            // Cleanup when component unmounts
            cancelAnimationFrame(animate);
        };
    }, []);

    return (
        <div className="torus-container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default SpaceStation;
