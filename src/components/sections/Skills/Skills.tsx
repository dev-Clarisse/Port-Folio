import '@/App.css'
import CrystalScene from "@/components/3D/CrystalScene"




function Skills() {
    return (
        <div className="flex flex-col items-center gap-8 pt-24 pb-16">
                    {/* <h2 className="text-3xl text-lilac-1000 text-center">
                        3D & Interactive
                    </h2>
                    <p className="text-lilac-1100 text-center max-w-md">
                        Fais glisser pour faire pivoter le cristal.
                    </p> */}
                    <CrystalScene />
                </div>
        
    )
}

export default Skills

