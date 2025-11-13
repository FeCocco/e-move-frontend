export default function BemVindo({ profileData }) {

    if (!profileData) {
        return null;
    }

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold font-orbitron mb-4">Bem-vindo(a), {profileData.nome}!</h1>
            <p className="text-texto-claro/80">Esse é o seu menu do aplicativo, sinta-se a vontade para se familiarizar com as abas.</p>
        </div>
    );
}